import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const partialsDir = path.join(__dirname, '..', 'templates', 'partials');

const steps = {
   NEW: 1,
   IN_PROGRESS: 2,
   IN_REVIEW: 3,
   NOT_FIXED: 4,
   FIXED: 4,
};

Handlebars.registerHelper('defectProcessData', function (defectStatus) {
   const options = [
      'Новый',
      'В процессе',
      'Проверка',
      defectStatus === 'NOT_FIXED' ? 'Не устранено' : 'Устранено',
   ];
   const step = steps[defectStatus] || 1;
   const isFailed = defectStatus === 'NOT_FIXED';

   return {
      options,
      step,
      isFailed,
      stepMinusOne: step - 1,
   };
});

const helpers = {
   eq: (a, b) => a === b,
   ne: (a, b) => a !== b,
   lt: (a, b) => a < b,
   gt: (a, b) => a > b,
   or: (a, b) => a || b,
   and: (a, b) => a && b,
   inc: (n) => n + 1,
   sub: (a, b) => a - b,
   length: (arr) => arr?.length ?? 0,
   stepMinusOne: function () { return this.step - 1; },
   progressColor: (isFailed, index, total, step) => {
      if (isFailed && index === total - 1) return 'red';
      if (index + 1 <= step) return 'green';
      if (index === step) return 'orange';
      return 'gray';
   },
   range: (start, end) => {
      const arr = [];
      for (let i = start; i <= end; i++) arr.push(i);
      return arr;
   },
};

Object.entries(helpers).forEach(([name, fn]) => {
   Handlebars.registerHelper(name, fn);
});

// Load Partials + CSS
async function registerPartials() {
   if (!await fs.pathExists(partialsDir)) {
      console.warn(`Not found partials folder: ${partialsDir}`);
      return;
   }

   const files = await fs.readdir(partialsDir);
   for (const file of files) {
      if (!file.endsWith('.hbs')) continue;

      const name = path.basename(file, '.hbs');
      const hbsPath = path.join(partialsDir, file);
      const cssPath = path.join(partialsDir, `${name}.css`);

      let content = await fs.readFile(hbsPath, 'utf-8');

      //If Css exists → add inside <style>
      if (await fs.pathExists(cssPath)) {
         const css = await fs.readFile(cssPath, 'utf-8');
         content = `<style>${css}</style>` + '\n' + content;
         console.log(`Added CSS: ${name}.css`);
      }

      Handlebars.registerPartial(name, content);
      console.log(`Partial loaded: ${name}`);
   }
}

registerPartials().catch(err => console.error('Error when loading partials: ', err));

export default Handlebars;
