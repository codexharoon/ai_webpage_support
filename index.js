import axios from 'axios';
import * as cheerio from 'cheerio';
import {client} from './lib/openai.js';
import {pinecone,indexName,getPineconeIndex} from './lib/pinecone.js';
import { showLoading } from './utils/loading.js';

async function scrapeWebPage(url = ""){
    const {data} = await axios.get(url);

    const $ = cheerio.load(data);

    const head = $('head').html();
    const body = $('body').html();

    const internalLinks = new Set();
    const externalLinks = new Set();

    $('a').each((_,element)=>{
        const link = $(element).attr('href');

        if (link === "/" || link === "#") return;
        if(link.startsWith("http" || link.startsWith("https"))){
            externalLinks.add(link);
        }
        else{
            internalLinks.add(link);
        }
    });

    return {
        head,
        body,
        internalLinks : Array.from(internalLinks),
        externalLinks : Array.from(externalLinks),
    }
}


async function generateVectorEmbeddings(text = ""){
    const embeddings = await client.embeddings.create({
        model: process.env.emb_model,
        input: text,
        encoding_format: "float",
      });

      return embeddings.data[0].embedding;
}

function chunkText(text, size) {
    if (typeof text !== "string" || typeof size !== "number" || size <= 0) {
        throw new Error("Invalid input: text must be a string and size must be a positive number.");
    }

    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.substring(i, i + size));
    }

    return chunks;
}

async function insertIntoVecDB({emb,url,head="",body=""}){
    
    const index = await getPineconeIndex();

    await index.upsert([
        {
            id : url,
            values : emb,
            metadata : {
                url,head,body
            }
        }
    ])
}


async function ingest(url = ""){

    console.log(`⏳ Ingesting... ${url}`);    

    const {head,body,internalLinks} = await scrapeWebPage(url);

    const headEmbeddings = await generateVectorEmbeddings(head);
    await insertIntoVecDB({
        emb:headEmbeddings,
        url,
        head,
    })

    const bodyChunks = chunkText(body, 4096);
    for (const chunk of bodyChunks){
        const bodyEmbeddings = await generateVectorEmbeddings(chunk);
        await insertIntoVecDB({
            emb:bodyEmbeddings,
            url,
            head,
            body:chunk
        });
    }

    // const bodyEmbeddings = await generateVectorEmbeddings(body);
    // await insertIntoVecDB({
    //     emb:bodyEmbeddings,
    //     url,
    //     head,
    //     body
    // });

    console.log(`✅ Ingested ${url}`);

    // for (const link of internalLinks){
    //     const _url = `${url}${link}`;
    //     await ingest(_url);
    // }
}



async function main(){

    try {
        await pinecone.createIndex({
            name: indexName,
            dimension: 768,
            metric: "cosine",
            spec: {
              serverless: {
                cloud: "aws",
                region: "us-east-1",
              },
            },
          });
    } catch (error) {
        if (error.message && error.message.includes("already exists")){
            // console.log("Index already exists");
        }
        else{
            console.error(`Error creating index: ${error.message}`);
        }
    }
    
    // scrapeWebPage("https://www.xblog.live").then((data)=>{
    //     console.log(data);
    // });

    
    // await ingest("https://www.xblog.live");
    // await ingest("https://www.xblog.live/about");
    // await ingest("https://www.xblog.live/contactus");
    // await ingest("https://www.xblog.live/faqs");

    // const question = "Can I request a specific topic for a blog?";
    const question = "Who can add blogs on XBlog?";

    
    
    // await ingest("https://miancarsrentalandtours.com");

    // const question = "who developed the website?";
    const qEmb = await generateVectorEmbeddings(question);

    const index = await getPineconeIndex();

    const result = await index.query({
        topK : 1,
        vector : qEmb,
        includeMetadata : true
    });

    const stopLoading = await showLoading(" 🤖 Thinking... ⏳");

    const chat = await client.chat.completions.create({
        model : process.env.chat_model,
        messages : [
            {
                role:"system",
                content : "You are an Intelligent AI that can answer questions about our website. You are expert in providing support to user on behalf of a webpage. You have to answer to the user in a simple and easy to understand way."
            },
            {
                role:"user",
                content:   `
                        User Query: ${question} \n\n
                        website url: ${result.matches.map((r)=>r.metadata.url).join(", ")} \n\n
                        reterived context: ${result.matches.map((r)=>r.metadata.body).join(", ")} \n\n
                    `
            }
        ]
    });

    stopLoading();

    console.log(`🤖: ${chat.choices[0].message.content}`);

}

main();