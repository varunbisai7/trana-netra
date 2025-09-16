export const sendRiskAlert = async (sectorName: string, riskLevel: 'high' | 'critical', percentage: number) => {
  const adminMobile = localStorage.getItem('adminMobile');
  const adminEmail = localStorage.getItem('adminEmail');
  
  if (!adminMobile || !adminEmail) {
    console.log('No admin contact details found for alerts');
    return;
  }

  const timestamp = new Date().toLocaleString();
  const alertMessage = `⚠️ Trana Netra Alert: Sector ${sectorName} is at ${riskLevel.toUpperCase()} Risk (${percentage}%) as of ${timestamp}. Immediate attention required.`;
  
  try {
    // Send SMS and Email alerts in parallel
    await Promise.all([
      fetch(`/api/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: adminMobile,
          message: alertMessage
        })
      }),
      fetch(`/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: adminEmail,
          subject: `Trana Netra ${riskLevel.toUpperCase()} Risk Alert - Sector ${sectorName}`,
          message: alertMessage
        })
      })
    ]);
    
    console.log(`Alert sent for Sector ${sectorName} - ${riskLevel} risk`);
  } catch (error) {
    console.error('Failed to send risk alert:', error);
  }
};