// ==UserScript==
// @name         eazy-leti
// @namespace    https://l1rn.org/
// @version      1.0
// @description  makes your life easier
// @author       l1rn
// @match        https://open.etu.ru/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etu.ru
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const btn = document.createElement('button');
    btn.id = 'show-me-button';
    btn.innerText = 'показать вопросы';
    btn.addEventListener('click', () => {
        (function () {
    let videoLength = 0;
    const videoElem = document.querySelector('video');
    const vidTimeElem = document.querySelector('.vidtime');

    if (videoElem && videoElem.duration) {
        videoLength = Math.floor(videoElem.duration);
    } else if (vidTimeElem && vidTimeElem.textContent.includes(' / ')) {
        const timeParts = vidTimeElem.textContent.split(' / ')[1].split(':');
        videoLength = timeParts.reduce((m, s) => m * 60 + +s, 0);
    }

    if (typeof HXVideoWatch !== 'undefined' && videoLength > 0) {
        HXVideoWatch.video_length = videoLength;
        HXVideoWatch.watch_times = HXVideoWatch.watch_times || [];
        for (let i = 0; i < videoLength * 10; i += 5) {
            HXVideoWatch.watch_times.push(parseFloat((i / 10 + Math.random() / 10).toFixed(6)));
        }
    }

    try {
        const videoDiv = document.querySelector("div.video[data-metadata]");
        if (videoDiv) {
            const metadataRaw = videoDiv.dataset.metadata.replace(/&quot;/g, '"');
            const metadata = JSON.parse(metadataRaw);

            if (metadata.publishCompletionUrl) {
                const csrfToken = document.cookie.split("; ").find(r => r.startsWith("csrftoken="))?.split("=")[1];
                fetch(metadata.publishCompletionUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Csrftoken": csrfToken || ""
                    },
                    body: JSON.stringify({ completion: 1 }),
                    credentials: "include"
                });
            }
        }
    } catch (e) {
        console.warn('Не удалось отправить статус просмотра:', e);
    }

    var questions = $('.in-video-problem-wrapper .xblock-student_view-problem');
    if (!questions.length) {
        console.log('Вопросы не найдены');
        return;
    }

    var currentIndex = 0;
    $('.video').hide();
    $('.sequence-bottom').hide();

    function showQuestion(index) {
        questions.hide();
        $(questions[index]).show();
    }

    showQuestion(currentIndex);

    $('.in-video-continue').off('click').on('click', function () {
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            showQuestion(currentIndex);
        } else {
            questions.hide();
            $('.video').show();
            $('.sequence-bottom').show();
        }
    });
})();
    })
    const navItemButtons = document.querySelector('nav.sequence-bottom')
    navItemButtons.appendChild(btn);
})();
