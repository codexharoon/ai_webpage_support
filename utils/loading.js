export async function showLoading(message = 'Loading', timeoutMs = 100) {
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${spinner[i]} ${message}`);
        i = (i + 1) % spinner.length;
    }, timeoutMs);
    
    return () => {
        clearInterval(interval);
        process.stdout.write('\r\x1b[K'); // Clear the line
    };
}