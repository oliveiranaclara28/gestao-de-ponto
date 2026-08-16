'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrarPontoPage() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Erro ao acessar webcam:', err));
  }, []);

  const handleBaterPonto = async () => {
    setLoading(true);
    setMensagem('');

    try {
      const response = await fetch('/api/ponto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar ponto');
      }

      setSucesso(true);
      setMensagem('Ponto registrado com sucesso!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setMensagem(err.message || 'Erro ao registrar ponto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-center">Registro de Ponto</h1>
          <p className="text-sm text-gray-400 text-center mt-1">
            Posicione-se em frente à câmera para auditoria
          </p>
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {mensagem && (
          <div
            className={`p-3 text-sm rounded-md border ${
              sucesso
                ? 'bg-green-600/20 text-green-400 border-green-800'
                : 'bg-red-600/20 text-red-400 border-red-800'
            }`}
          >
            {mensagem}
          </div>
        )}

        <button
          onClick={handleBaterPonto}
          disabled={loading || sucesso}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-md disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Registrando...' : 'Confirmar e Bater Ponto'}
        </button>

        <div className="text-center">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}