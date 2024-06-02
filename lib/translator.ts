// import Nightmare from 'nightmare';

// export const translator = async (text: string, to: string, from: string = 'auto'): Promise<string | undefined> => {
//   try {
//     const nightmare = new Nightmare({
//       ignoreDownloads: true,
//       waitTimeout: 60000,
//     });

//     const url = `https://translate.google.com/?sl=${from}&text=${text}&tl=${to}&op=translate`;
//     const translatedText = await nightmare
//       .goto(url)
//       .evaluate(() => {
//         // click ok on google consent
//         const button = document.querySelector('form[action="https://consent.google.com/s"] button') as HTMLElement;
//         if (button) {
//           button.click();
//         }
//       })
//       .wait('span[jsname=jqKxS]')
//       .wait(500)
//       .evaluate(() => (document.querySelector('span[jsname=jqKxS]') as HTMLElement).innerText)
//       .end();

//     if (!translatedText) {
//       throw new Error('Unable to translate.');
//     }

//     return translatedText.toString();
//   } catch (error) {
//     console.error(error);
//     // throw new Error(error);
//   }
// };
