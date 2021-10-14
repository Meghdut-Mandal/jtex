AJS.toInit(function () {
    window.MathJax = {
        loader: {
            load: [
                'input/tex', '[tex]/newcommand', '[tex]/action',
                'output/chtml'
            ]
        },

        TeX: {
            packages: ['full', 'newcommand', 'action'],
            extensions: ["autoload-all.js", "enclose.js", "extpfeil.js", "begingroup.js"]
        },
        chtml: {
            scale: 1.2 // size of the equations compared to the text
        }, startup: {
            ready: () => {
                //console.log('MathJax is loaded, but not yet initialized');
                MathJax.startup.defaultReady();
                // console.log('MathJax is initialized, and the initial typeset is queued');
                typesetLatex(); // render all math
            }
        }
    };
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);

    console.log("JETX loaded!");
    if (window.location.pathname.startsWith('/browse/ESC-28874')) {
        console.log('ESC ticket found !!');
        function typesetLatex() {
            // Find out all nodes which have the preformatted class
            const commentFields = document.querySelectorAll('.preformatted');

            for (var i = 0; i < commentFields.length; i++) {
                const field = commentFields[i];
                if (field.ownerDocument == document) { // check if the field is not inside the edit comment dialog.
                    // Make a Span element which will contain the Rendered Latex
                    const content = document.createElement('span');
                    const options = MathJax.getMetricsFor(content);
                    content.textContent = field.innerText;
                    content.style = 'line-height:0%';
                    content.style.paddingTop = "100px";
                    // Replace the existing element
                    field.parentNode.replaceChild(content, field);
                    // Perform Typesetting of the Math
                    MathJax.typeset([content]);
                }
            }
        }

        // Add a Render latex button to the UI
        const sampleButton = document.querySelector('.aui-button.toolbar-trigger.issueaction-workflow-transition');

        const pannelwrapper = document.querySelectorAll('.aui-item.issue-side-column')[0];
        const button = sampleButton.cloneNode(false);
        button.innerHTML = '<p>Render Latex</p>';
        button.id = 'render.latex';
        button.class = 'aui-buttons pluggable-ops';
        button.href = '';
        button.style.marginTop = "15px";
        button.onclick = function () {
            typesetLatex();
            MathJax.typeset()
        };
        pannelwrapper.insertBefore(button, pannelwrapper.lastChild);

        var target = document.body;
        // Options for the observer (which mutations to observe)
        var config = {childList: true, subtree: true};

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList) {
            // console.log('A child node has been modified');
            typesetLatex(); // render all math
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(target, config);
    }
});
