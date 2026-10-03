'use client';                                                                                       
                                                                                                        
    import { useState } from 'react';                                                                   
    import { createBrowserClient } from '@supabase/ssr';                                                
    import { useRouter } from 'next/navigation';                                                        
                                                                                                        
    export default function LoginPage() {                                                               
      const [email, setEmail] = useState('');                                                           
      const [password, setPassword] = useState('');                                                     
      const [error, setError] = useState('');                                                           
      const router = useRouter();                                                                       
                                                                                                        
      const supabase = createBrowserClient(                                                             
        process.env.NEXT_PUBLIC_SUPABASE_URL!,                                                          
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!                                                      
      );                                                                                                
                                                                                                        
      const handleLogin = async (e: React.FormEvent) => {                                               
        e.preventDefault();                                                                             
        const { error } = await supabase.auth.signInWithPassword({ email, password });                  
                                                                                                        
        if (error) setError(error.message);                                                             
        else router.push('/admin'); // Redirect to CMS on success                                       
      };                                                                                                
                                                                                                        
      return (                                                                                          
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">                              
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>                                      
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}                               
                                                                                                        
          <form onSubmit={handleLogin} className="flex flex-col gap-4">                                 
            <input                                                                                      
              type="email" placeholder="Email" required                                                 
              className="border p-2 rounded"                                                            
              value={email} onChange={(e) => setEmail(e.target.value)}                                  
            />                                                                                          
            <input                                                                                      
              type="password" placeholder="Password" required                                           
              className="border p-2 rounded"                                                            
              value={password} onChange={(e) => setPassword(e.target.value)}                            
            />                                                                                          
            <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold">             
              Login                                                                                     
            </button>                                                                                   
          </form>                                                                                       
        </div>                                                                                          
      );                                                                                                
    }   