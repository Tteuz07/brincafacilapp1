# 🐕 Imagens do Bluey - Organização

## 📁 Estrutura de Arquivos

As imagens do desenho Bluey foram organizadas na pasta `public/desenhos/bluey/` com os seguintes arquivos:

### 🖼️ Imagem Principal
- **`blueycapa.jpeg`** - Imagem principal/capa do desenho Bluey
  - Tamanho: 11KB
  - Usada como `image` e `thumbnail_url` no store

### 🎬 Galeria de Imagens
- **`bluey1.jpeg`** - Imagem adicional 1 (17KB)
- **`bluey2.jpeg`** - Imagem adicional 2 (12KB) 
- **`bluey3.jpeg`** - Imagem adicional 3 (16KB)
- **`bluey4.jpeg`** - Imagem adicional 4 (9KB)
- **`bluey5.jpeg`** - Imagem adicional 5 (14KB)
- **`bluey6.jpeg`** - Imagem adicional 6 (12KB)

## 🔧 Configuração no Store

As imagens foram configuradas no arquivo `src/store/useAppStore.js`:

```javascript
{
  id: 1,
  title: 'Bluey',
  description: 'Aventuras da cachorrinha Bluey e sua família...',
  category: 'educational',
  min_age: 2,
  max_age: 7,
  duration: 22,
  rating: 4.9,
  image: '/desenhos/bluey/blueycapa.jpeg',
  thumbnail_url: '/desenhos/bluey/blueycapa.jpeg',
  gallery: [
    '/desenhos/bluey/blueycapa.jpeg',
    '/desenhos/bluey/bluey1.jpeg',
    '/desenhos/bluey/bluey2.jpeg',
    '/desenhos/bluey/bluey3.jpeg',
    '/desenhos/bluey/bluey4.jpeg',
    '/desenhos/bluey/bluey5.jpeg',
    '/desenhos/bluey/bluey6.jpeg'
  ],
  video_url: 'https://www.youtube.com/watch?v=example-bluey'
}
```

## 📱 Como é Exibido

- **`image`** - Campo principal para compatibilidade
- **`thumbnail_url`** - Usado pelo componente CartoonCard para exibir a imagem
- **`gallery`** - Array com todas as imagens para uso futuro (galeria, detalhes, etc.)

## 🎯 Resultado

Agora o desenho Bluey exibe corretamente a imagem `blueycapa.jpeg` como imagem principal em todos os lugares onde é mostrado no aplicativo, incluindo:

- Cards de desenhos na página inicial
- Lista de desenhos na página de desenhos
- Cards compactos e expandidos
- Sistema de favoritos

## 🚀 Próximos Passos

Para expandir o uso das imagens, você pode:

1. Criar uma galeria de imagens na página de detalhes do desenho
2. Usar as imagens adicionais como thumbnails de episódios
3. Implementar um carrossel de imagens
4. Adicionar as imagens ao sistema de busca e filtros





