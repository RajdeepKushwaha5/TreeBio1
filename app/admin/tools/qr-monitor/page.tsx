import QRCodeMonitor from "@/components/qr-code-monitor";
import QRCodeValidator from "@/components/qr-code-validator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QRCodeMonitorPage() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monitor">Full Test Suite</TabsTrigger>
          <TabsTrigger value="validator">Real-time Validator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitor">
          <QRCodeMonitor />
        </TabsContent>
        
        <TabsContent value="validator">
          <QRCodeValidator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
