# TaskMaster - Gerenciador de Tarefas com Kanban

## 📋 Descrição
O TaskMaster é um aplicativo móvel para gerenciamento de tarefas pessoais com:
- ✅ Autenticação de usuários
- 📝 CRUD completo de tarefas
- 🎯 Quadro Kanban interativo (Para Fazer, Em Andamento, Concluída)
- 📱 Desenvolvido com React Native e TypeScript

## ⚙️ Pré-requisitos
- Node.js v20.11.1
- Yarn 1.22.19
- Expo CLI (instalado globalmente)
- Android Studio/Xcode (para emuladores) ou dispositivo físico

## 🚀 Instalação e Execução
1. Clone o repositório
```bash
git clone https://github.com/HugoDeSouzaCaramez/taskmaster.git
cd taskmaster

## Instale as dependências
yarn install

## Configure o ambiente (opcional) Edite o arquivo src/config/environment.ts se necessário
export const Environment = {
  API_BASE_URL: 'http://sua-api-real.com',
  MOCK_API: false
};

## Inicie o projeto
yarn start

## Opções de execução
Android (emulador/dispositivo físico):
Pressione a no terminal Expo ou escaneie o QR code com o app Expo Go

iOS (simulador/dispositivo físico):
Pressione i no terminal Expo ou escaneie o QR code com a câmera do dispositivo

Web:
Pressione w no terminal Expo

## 🔧 Desenvolvimento
Criando uma development build (Android)
bash
npm install -g eas-cli
eas build:configure
eas build --profile development --platform android

## 📚 Bibliotecas Principais
React Native 0.79.2

React Navigation 7.x

React Native Paper 5.x

React Hook Form 7.x

Axios + Mock Adapter

Reanimated + Gesture Handler (para interações)


