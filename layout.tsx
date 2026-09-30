import type { Metadata,Viewport } from 'next';
import './globals.css';
import './interface.css';
export const metadata:Metadata={title:'Trilha · Inovação e Competitividade',description:'Seu espaço para aprender, praticar e evoluir.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'Trilha',statusBarStyle:'default'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#174d42'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
