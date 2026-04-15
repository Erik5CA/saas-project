'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/api/useAuth';
import { Button, Input, Card } from '@/components/ui';
import Link from 'next/link';
import { Layout } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn } = useAuth();
  const [errorLocal, setErrorLocal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    
    try {
      login({ email, password });
    } catch (err: any) {
      setErrorLocal('Credenciales inválidas. Por favor intente de nuevo.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-2 transition-transform hover:scale-110">
            <Layout size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-slate-500 max-w-[280px]">
            Ingresa tus credenciales para acceder a tu plataforma de proyectos
          </p>
        </div>

        <Card className="p-6 sm:p-8 backdrop-blur-sm bg-white/80 border-white/40 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoggingIn}
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Contraseña</label>
                <Link href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>

            {errorLocal && (
              <p className="text-xs font-medium text-rose-500 animate-in fade-in zoom-in">{errorLocal}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              isLoading={isLoggingIn}
            >
              Iniciar sesión
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">¿No tienes una cuenta? </span>
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Regístrate gratis
            </Link>
          </div>
        </Card>

        <p className="px-8 text-center text-xs leading-relaxed text-slate-400">
          Al hacer clic en continuar, aceptas nuestros{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-indigo-600">términos de servicio</Link>{' '}
          y{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-indigo-600">política de privacidad</Link>.
        </p>
      </div>
    </div>
  );
}
