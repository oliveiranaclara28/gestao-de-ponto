'use client';

import { useState, useRef, useEffect } from 'react';
import { api, AppError } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function RegistrarPontoPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  // Iniciar a webcam ao carregar a página
  useEffect(() => {
    async function iniciarCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setErro('Não foi possível acessar a webcam. Verifique as permissões do navegador.');
      }
    }

    iniciarCamera();

    // Cleanup: desliga a câmera ao sair da tela
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Função para tirar a foto
  function tirarFoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFotoCapturada(dataUrl);
      }
    }
  }

  // Função para refazer a foto
  function refazerFoto() {
    setFotoCapturada(null);
  }

  // Enviar o registro de ponto para a API
  async function handleSubmitPonto(e: React.FormEvent) {
    e.preventDefault();
    if (!fotoCapturada) {
      setErro('É obrigatório capturar a foto para registrar o ponto.');
      return;
    }

    setCarregando(true);
    setErro('');
    setMensagem('');

    try {
      // Converte o DataURL (base64) em Blob para enviar como arquivo via FormData
      const res = await fetch(fotoCapturada);
      const blob = await res.blob();
      const file = new File([blob], 'evidencia-ponto.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('foto', file);
      // Se precisar mandar dados extras (ex: tipo de registro: 'ENTRADA', 'SAIDA'), adicione aqui:
      // formData.append('tipo', 'ENTRADA');

      await api.post('/ponto', formData);

      setMensagem('Ponto registrado com sucesso!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      if (err instanceof AppError) {
        setErro(err.message);
      } else {
        setErro('Erro ao registrar o ponto. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Registro de Ponto</h1>
          <p className="text-sm text-gray-400 mt-1">Capture sua imagem para validar o registro de auditoria</p>
        </div>

        {erro && (
          <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="p-3 text-sm text-green-400 bg-green-950/50 border border-green-800 rounded-lg">
            {mensagem}
          </div>
        )}

        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
          {!fotoCapturada ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={fotoCapturada} 
              alt="Evidência capturada" 
              className="w-full h-full object-cover"
            />
          )}
          {/* Canvas oculto usado para processar a captura */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-4">
          {!fotoCapturada ? (
            <button
              type="button"
              onClick={tirarFoto}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Capturar Foto
            </button>
          ) : (
            <button
              type="button"
              onClick={refazerFoto}
              className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition"
            >
              Tirar Outra Foto
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitPonto}>
          <button
            type="submit"
            disabled={!fotoCapturada || carregando}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg transition cursor-pointer"
          >
            {carregando ? 'Enviando Registro...' : 'Confirmar e Bater Ponto'}
          </button>
        </form>
      </div>
    </div>
  );
}