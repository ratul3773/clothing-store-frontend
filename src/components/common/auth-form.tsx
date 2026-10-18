import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { Card } from '@/components/ui/card';
import Login from './login-form';
import RegisterForm from './Register-form';

export function AuthForm() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="login" className="w-full">
        
        {/* Full-width stretch tabs: looks balanced on both mobile & desktop */}
        <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-md">
          <TabsTrigger value="login" className="rounded-sm font-semibold">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="rounded-sm font-semibold">
            Register
          </TabsTrigger>
        </TabsList>
        
        {/* Removed double-borders and bg-fills to fit outer card container cleanly */}
        <Card className="shadow-none border-0 py-0 mt-4 bg-transparent">
          <TabsContents className="py-2">
            <TabsContent value="login" className="flex flex-col gap-6">
              <Login />
            </TabsContent>
            
            <TabsContent value="register" className="flex flex-col gap-6">
              <RegisterForm />
            </TabsContent>
          </TabsContents>
        </Card>
      </Tabs>
    </div>
  );
}