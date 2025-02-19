document.addEventListener('DOMContentLoaded',() => {

    setCreatorMode();

    function setCreatorMode()
    {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('guideCreator');

        if(!myParam) {
            return;
        }

        if(window.guideSelectors) {
            const selectors = window.guideSelectors;
            for (const [_, selector] of Object.entries(selectors)) {
                let elements = document.querySelectorAll(`${selector}`);
                if(elements) {
                    elements.forEach(el => {
                        el.setAttribute('draggable','true');
                        el.classList.add('draggable');
                    })
                }
            }
        } else {
            const inputs = document.querySelectorAll('input:not([type=hidden])');
            if(inputs) {
                inputs.forEach(input => {
                    input.setAttribute('draggable','true');
                    input.classList.add('draggable');
                })
            }

            if(document.querySelector('form')) {
                const formGroupEls = document.querySelectorAll('.form-group');
                if(formGroupEls) {
                    formGroupEls.forEach(el => {
                        el.setAttribute('draggable','true');
                        el.classList.add('draggable');
                    });
                }
            }
        }
    }

    document.querySelector('body').addEventListener('click',e => {
        if(e.target.id === 'js-intro-guide') {
            e.preventDefault();
            startIntro();
        }
    });

    function startIntro() {
        const intro = introJs();
        intro.setOptions({
            steps: window.guideRules || []
        });

        intro.setOption("prevLabel",window.guideLabels.prevLabel || 'Prev' );
        intro.setOption("nextLabel",window.guideLabels.nextLabel || 'Next' );
        intro.setOption("skipLabel",window.guideLabels.skipLabel || 'Skip' );
        intro.setOption("doneLabel",window.guideLabels.doneLabel || 'Done' );
        intro.start();
    }

    document.addEventListener("dragstart", function( event ) {
        // store a ref. on the dragged elem
        let dragged = event.target;
        onDragStart(event);
    }, false);

    document.addEventListener("dragend", function( event ) {
        // reset the transparency
        event.target.style.backgroundColor = "";
    }, false);

    function onDragStart(event) {
        if(event.target.id.length) {
            event.dataTransfer.setData('selector', `#${event.target.id}`);
        } else {
            const classNames = event.target.classList;
            let selector = '';
            classNames.forEach(className => {
                if(className !== 'draggable') {
                    selector += `.${className}`;
                }
            })
            event.dataTransfer.setData('selector', selector);
        }

        event.target.style.backgroundColor = '#8db3f2';
    }

    document.querySelector('body').addEventListener('click',function(e) {
        if(e.target.id === 'js-goto-page') {
            e.preventDefault();
            if(document.getElementById('js-url-input') && document.getElementById('js-url-input').value !== '') {
                const url = new URL(document.getElementById('js-url-input').value);
                if(Array.from(url.searchParams).length) {
                    window.open(document.getElementById('js-url-input').value + '&guideCreator=1','_blank');
                } else {
                    window.open(document.getElementById('js-url-input').value + '?guideCreator=1','_blank');
                }
            }
        }

        if(e.target.classList.contains('js-remove-el')) {
            e.preventDefault();
            const stepsContainer = e.target.closest('#js-el-container');
            e.target.closest('.js-rule-container').remove();

            updateSteps(stepsContainer);
        }
    });

    function updateSteps(stepsContainer)
    {
        const stepElementsContainers = stepsContainer.querySelectorAll('.js-rule-container');

        let step = 0;
        stepElementsContainers.forEach(container => {

            container.querySelector('.js-step').name = 'PageGuide[rules]['+step+'][step]';
            container.querySelector('.js-step').value = step + 1;
            container.querySelector('.js-element').name = 'PageGuide[rules]['+step+'][element]';
            container.querySelector('.js-intro').name = 'PageGuide[rules]['+step+'][intro]';

            step++;
        })
    }

    document.querySelector('body').addEventListener('input', e => {
        if(e.target.id === 'js-url-input') {
            document.querySelector('.js-url-form-input').value = e.target.value;
        }
    })

    function addElement() {

        const stepsElements = document.querySelectorAll('.js-rule-container');
        const count = stepsElements.length;

        const lastEl = stepsElements[count-1];
        if(!lastEl.querySelector('.js-element').value.length) {
            return;
        }

        let tmpl = document.getElementById('element-input-template').content.cloneNode(true);
        tmpl.querySelector('.js-step').name = 'PageGuide[rules]['+count+'][step]';
        tmpl.querySelector('.js-step').value = count + 1;
        tmpl.querySelector('.js-element').name = 'PageGuide[rules]['+count+'][element]';
        tmpl.querySelector('.js-intro').name = 'PageGuide[rules]['+count+'][intro]';
        document.getElementById('js-el-container').appendChild(tmpl);
    }

    /* events fired on the drop targets */
    document.addEventListener("dragover", function( event ) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function( event ) {
        // highlight potential drop target when the draggable element enters it
        if (event.target.classList && event.target.classList.contains("js-dragzone")) {
            event.target.style.background = "#e83b3b";
        }
    }, false);

    document.addEventListener("dragleave", function( event ) {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.classList && event.target.classList.contains("js-dragzone")) {
            event.target.style.background = "";
        }
    }, false);

    document.addEventListener("drop", function( event ) {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        // move dragged elem to the selected drop target
        if (event.target.classList && event.target.classList.contains("js-dragzone")) {
            event.target.style.background = "";
            onDrop(event);
        }

    }, false);

    function onDrop(event) {
        const selector = event.dataTransfer.getData('selector');
        const dropzone = event.target;
        dropzone.parentElement.querySelector('.js-element').value = selector;
        addElement();
    }
});

