import * as React from 'react';
import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { animateFadeLeft } from '@/_animation/Animates';

const AlertSucesso = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // Força o alerta a aparecer quando a mensagem muda
      setIsVisible(true);

      // Auto-fechar após 5 segundos
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsVisible(false);
    }
  }, [message]); // Depende apenas da mensagem

  if (!message || !isVisible) return null;

  return (
    <Alert
      className={`${animateFadeLeft}relative bg-green-50 border-green-500`}
    >
      <AlertTitle className="text-green-800 font-medium">Sucesso!</AlertTitle>
      <AlertDescription className="text-green-700">{message}</AlertDescription>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-green-100 border-green-700"
        aria-label="Fechar"
      >
        <X className="h-4 w-4 text-green-700" />
      </button>
    </Alert>
  );
};

const AlertErro = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsVisible(false);
    }
  }, [message]);

  if (!message || !isVisible) return null;

  return (
    <Alert className={`${animateFadeLeft}relative bg-red-50 border-red-500`}>
      <AlertTitle className="text-red-800 font-medium">Erro!</AlertTitle>
      <AlertDescription className="text-red-700">{message}</AlertDescription>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 border-red-700"
        aria-label="Fechar"
      >
        <X className="h-4 w-4 text-red-700" />
      </button>
    </Alert>
  );
};

export { AlertSucesso, AlertErro };
