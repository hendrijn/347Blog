async function initializeTinkerer(tinkerer, aceOptions) {
  let htmlEditor = tinkerer.querySelector('.html-editor');
  let cssEditor = tinkerer.querySelector('.css-editor');
  let jsEditor = tinkerer.querySelector('.js-editor');
  const preview = tinkerer.querySelector('.preview');

  const htmlFile = `/code/${htmlEditor.dataset.file}`;

  let html0 = await fetch(`/code/${htmlEditor.dataset.file}`).then(response => response.text());
  htmlEditor = ace.edit(htmlEditor);
  htmlEditor.session.setMode('ace/mode/html');
  htmlEditor.setTheme('ace/theme/vibrant_ink');
  htmlEditor.setOptions(aceOptions);
  htmlEditor.setValue(html0, -1);

  if (cssEditor) {
    const css0 = await fetch(`/code/${cssEditor.dataset.file}`).then(response => response.text());
    cssEditor = ace.edit(cssEditor);
    cssEditor.session.setMode('ace/mode/css');
    cssEditor.setTheme('ace/theme/vibrant_ink');
    cssEditor.setOptions(aceOptions);
    cssEditor.setValue(css0, -1);
  }

  if (jsEditor) {
    const js0 = await fetch(`/code/${jsEditor.dataset.file}`).then(response => response.text());
    jsEditor = ace.edit(jsEditor);
    jsEditor.session.setMode('ace/mode/javascript');
    jsEditor.setTheme('ace/theme/vibrant_ink');
    jsEditor.setOptions(aceOptions);
    jsEditor.setValue(js0, -1);
  }

  const isBody = !html0.startsWith('<!DOCTYPE');

  const synchronizePreview = () => {
    let html = htmlEditor.getValue();
    if (isBody) {
      html = `<!DOCTYPE html>
<html>

<head>
  <title>...</title>
</head>

<body>
${html}
</body>

</html>
      `;
    }

    let source = html;

    if (cssEditor) {
      source = source.replace('<head>', `
    <style>
${cssEditor.getValue()}
    </style>
  </head>
      `);
    }

    if (jsEditor) {
      source = source.replace('</body>', `
    <script>
${jsEditor.getValue()}
    </script>
  </head>
      `);
    }

    preview.addEventListener('load', () => {
      function nop(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }

      const selfAnchors = preview.contentDocument.querySelectorAll('a[href="#"]');
      for (let anchor of selfAnchors) {
        anchor.addEventListener('click', nop);
      }
    });

    preview.srcdoc = source;

  };

  const popupButton = tinkerer.querySelector('.popup-button');
  if (popupButton) {
    popupButton.addEventListener('click', () => {
      const popup = window.open('about:blank', '_blank');
      popup.document.write(preview.srcdoc);
      popup.document.close();
      return false;
    });
  }

  synchronizePreview();
  htmlEditor.addEventListener('input', synchronizePreview);
  if (cssEditor) {
    cssEditor.addEventListener('input', synchronizePreview);
  }
  if (jsEditor) {
    jsEditor.addEventListener('input', synchronizePreview);
  }
}

async function initializeTinkerers() {
  ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12');
  const aceOptions = {
    wrap: false,
    showPrintMargin: false,
    fontSize: 16,
    useWorker: false,
    tabSize: 2,
    useSoftTabs: true,
    // enableBasicAutocompletion: false,
    // enableLiveAutocompletion: false,
    behavioursEnabled: false,
    highlightActiveLine: false,
  };

  const tinkerers = document.querySelectorAll('.tinkerer'); 
  for (let tinkerer of tinkerers) {
    initializeTinkerer(tinkerer, aceOptions);
  }
}

initializeTinkerers();
