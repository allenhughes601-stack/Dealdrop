export async function sendAlertWebhook(message:string) {
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;

    if(!webhookUrl){
        console.warn('No ALERT_WEBOOK_URL configured. Skipping alert.');
        return;
    }

    try{
        await fetch(webhookUrl, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                text:`*Pipeline Alert: \n${message}`
            }),
        });
    }catch(err){
        console.error('Failed to send webhook alert',err);
    }
}