'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/api/useAuth';
import { Button, Input, Card } from '@/components/ui';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, isSigningUp } = useAuth();
  const [errorLocal, setErrorLocal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    
    try {
      signUp({ email, password });
    } catch (err: any) {
      setErrorLocal('Ocurrió un error al crear la cuenta. Por favor intente de nuevo.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-2 transition-transform hover:scale-110">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Crea tu cuenta
          </h1>
          <p className="text-sm text-slate-500 max-w-[280px]">
            Empieza hoy mismo a gestionar tus proyectos de forma profesional
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
              disabled={isSigningUp}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Contraseña</label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSigningUp}
              />
            </div>

            {errorLocal && (
              <p className="text-xs font-medium text-rose-500 animate-in fade-in zoom-in">{errorLocal}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              isLoading={isSigningUp}
            >
              Registrarse
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Inicia sesión
            </Link>
          </div>
        </Card>

        <p className="px-8 text-center text-xs leading-relaxed text-slate-400">
          Al registrarte, aceptas nuestros{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-indigo-600">términos de servicio</Link>{' '}
          y{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-indigo-600">política de privacidad</Link>.
        </p>
      </div>
    </div>
  );
}
