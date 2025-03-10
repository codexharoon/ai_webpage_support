import { Pinecone } from "@pinecone-database/pinecone";

export const indexName = "ai-agent";

export const pinecone = new Pinecone({
  apiKey: "pclocal",
  controllerHostUrl: "http://localhost:5080",
});

export const getPineconeIndex = async () => {
  // Get the index host
  const indexHost = (await pinecone.describeIndex(indexName)).host;

  // Target the index
  const index = pinecone.index(indexName, "http://" + indexHost);

  return index;
};
