/** Tema yang sama dengan konfigurasi CDN sebelumnya, tapi sekarang dikompilasi. */
export default {
  content: ['./shell.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        milk:'#FFFDF9', card:'#FFFDFB', edge:'#F3E7EA', ink:'#5A4E4D', soft:'#7E7271',
        berry:'#FF9EAA', blush:'#FFC0D3', matcha:'#E2F0D9', leaf:'#A3C79B',
        butter:'#FFF3CD', lav:'#E8D8E8'
      },
      fontFamily: {
        hand: ['"Shantell Sans"','"Comic Sans MS"','cursive'],
        sans: ['"Plus Jakarta Sans"','system-ui','-apple-system','sans-serif']
      }
    }
  }
};
