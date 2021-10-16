AJS.toInit(function () {
    window.MathJax = {
          loader: {
        load: [
          'input/tex', '[tex]/newcommand', '[tex]/action',
          'output/chtml'
      ]
    },
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        processEscapes: true,
        // packages: ['full', 'newcommand', 'action'],
        extensions: ["autoload-all.js","enclose.js","extpfeil.js","begingroup.js"]
    },
          chtml: {
       scale: 1.2 // size of the equations compared to the text
   },startup: {
      ready: () => {
        //console.log('MathJax is loaded, but not yet initialized');
        MathJax.startup.defaultReady();
        typesetLatex();
        // console.log('MathJax is initialized, and the initial typeset is queued');
    }
  },
      };

    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);

    function typesetLatex(){
        if(!JIRA.Issue.getIssueKey().startsWith('ESC')) 
            return;

       console.log(window.MathJax+' 454');
      // Find out all nodes which have the preformatted class
      const commentFields = document.querySelectorAll('.preformatted');

      for(var i=0;i<commentFields.length;i++)
        {
            const field=commentFields[i];
            if(field.ownerDocument == document) { // check if the field is not inside the edit comment dialog.
                // Make a Span element which will contain the Rendered Latex
                const content = document.createElement('span');
                const options = MathJax.getMetricsFor(content);
                content.textContent = field.innerText;
                content.style='line-height:0%';
                content.style.paddingTop="100px";
                // Replace the existing element
                field.parentNode.replaceChild(content,field);
                // Perform Typesetting of the Math
                MathJax.typeset([content]);
            }
        }
    }

    JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context, reason) {
        console.log('A child node has been modified 454', reason);
        typesetLatex();

    });
    }
});
