import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Phone, Mail, Send, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AlertsPanel = () => {
  const { toast } = useToast();
  const [adminMobile, setAdminMobile] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[0-9]{10,15}$/;
    return mobileRegex.test(mobile);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleMobileChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 15) {
      setAdminMobile(numericValue);
      setIsValidMobile(validateMobile(numericValue));
    }
  };

  const handleEmailChange = (value: string) => {
    setAdminEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  const handleSave = () => {
    if (!adminMobile || !adminEmail) {
      toast({
        title: "Validation Error",
        description: "Please fill in both mobile number and email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidMobile || !isValidEmail) {
      toast({
        title: "Validation Error", 
        description: "Please enter valid mobile number and email address.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('adminMobile', adminMobile);
    localStorage.setItem('adminEmail', adminEmail);

    toast({
      title: "Admin Details Saved",
      description: "Admin contact details have been saved successfully.",
    });
  };

  const handleTestAlert = async () => {
    if (!adminMobile || !adminEmail || !isValidMobile || !isValidEmail) {
      toast({
        title: "Error",
        description: "Please save valid admin details first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const testMessage = `⚠️ Trana Netra Test Alert: This is a test message from the alert system. Your contact details are working correctly. Timestamp: ${new Date().toLocaleString()}`;
      
      // Send test alerts via edge functions
      console.log('API Called);
      await Promise.all([
        fetch('https://api-send-sms.onrender.com/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: adminMobile,
            body: testMessage
          })
        }),
        /* fetch(`/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: adminEmail,
            subject: 'Trana Netra Test Alert',
            message: testMessage
          })
        }) */
      ]);
      console.log('Api ended');

      toast({
        title: "Test Alert Sent",
        description: `Test alerts sent to ${adminEmail} and ${adminMobile}`,
      });
    } catch (error) {
      toast({
        title: "Test Alert Failed",
        description: "Failed to send test alerts. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  // Load saved data on component mount
  useState(() => {
    const savedMobile = localStorage.getItem('adminMobile');
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedMobile) setAdminMobile(savedMobile);
    if (savedEmail) setAdminEmail(savedEmail);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alert Management
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Admin's Mobile Number
              </Label>
              <Input
                id="mobile"
                value={adminMobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                placeholder="Enter 10-15 digit mobile number"
                maxLength={15}
                className={!isValidMobile && adminMobile ? 'border-destructive' : ''}
              />
              {!isValidMobile && adminMobile && (
                <p className="text-sm text-destructive">Please enter a valid 10-15 digit mobile number</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Admin's Email ID
              </Label>
              <Input
                id="email"
                type="email"
                value={adminEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter admin email address"
                className={!isValidEmail && adminEmail ? 'border-destructive' : ''}
              />
              {!isValidEmail && adminEmail && (
                <p className="text-sm text-destructive">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestAlert}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Test Alert
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> The system will automatically send alert messages to the saved 
              mobile number and email address whenever Critical or High Risk is triggered in any sector.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
