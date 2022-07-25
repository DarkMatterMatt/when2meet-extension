(function() {
    'use strict';

    const save = () => {
        const userId = window.UserID;
        const available = window.AvailableAtSlot;
        const times = window.TimeOfSlot;

        if (!userId) {
            alert('Not logged in!');
            return;
        }

        const myAvailability = available
            .map(slot => slot.includes(userId))
            .map((available, idx) => [times[idx], available]);

        const str = myAvailability.toJSON ? myAvailability.toJSON() : JSON.stringify(myAvailability);
        localStorage.setItem('myAvailability', str);
        alert('Saved!');
    };

    const load = async () => {
        const userId = window.UserID;
        const eventId = +location.search.slice(1).split('-')[0];
        const available = window.AvailableAtSlot;
        const times = window.TimeOfSlot;
        const render = window.ReColorIndividual;

        if (!userId) {
            alert('Not logged in');
            return;
        }

        if (!localStorage.getItem('myAvailability')) {
            alert('Nothing saved yet!');
            return;
        }

        const myAvailability = new Map(JSON.parse(localStorage.getItem('myAvailability')));
        for (let i = 0; i < available.length; i++) {
            if (myAvailability.has(times[i])) {
                available[i] = available[i].filter(id => id !== userId);
                if (myAvailability.get(times[i])) {
                    available[i].push(userId);
                }
            }
        }

        render();

        const params = {
            person: userId,
            event: eventId,
            slots: times.join(),
            availability: available.map(slot => +slot.includes(userId)).join(''),
        };

        await fetch('https://www.when2meet.com/SaveTimes.php', {
            'headers': { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            'body': new URLSearchParams(params),
            'method': 'POST',
        });
        alert('Loaded!');
    };

    const createButton = (text, cb) => {
        const $btn = document.createElement('button');
        $btn.style = 'margin-top: 4px';
        $btn.innerText = text;
        $btn.addEventListener('click', cb);
        return $btn;
    }

    const $navBar = document.getElementById('MenuTopRight');
    $navBar.appendChild(createButton('Save', save));
    $navBar.appendChild(createButton('Load', load));
})();
