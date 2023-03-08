'use strict';

const axios = require("axios");
const dayjs = require("dayjs");

const DAYS_API_URL = "https://www.daysoftheyear.com/api/v1/";

async function daysOfTheYear(query, API_KEY) {

    const data = await getMemorableDays(API_KEY);
    if (!data || data.error) {
        return;
    }

    return `
    <div id="presearch-daysOfTheYear-package">
        <section>
            <div class="header">
                <div class="day-date"></div>
                <div>
                    ${data.map((day, index) => { return '<button data-day="' + index + '">' + day.name + '</button>'; }).join('')}
                </div>
            </div>
            <div class="day-tags">
            </div>

            <div class="day-info">
                <div class="day-name"><a></a></div>
                <div class="day-description"></div>
            </div>
            <div class="powered-by">
                Powered by <a title="Days Of The Year" href="https://www.daysoftheyear.com">Days Of The Year</a>. 
            </div>
        </section>
    </div>

    <script>
        (()=> {  
            const data = ${JSON.stringify(data)};
            let selectedDay;

            const decodedString = (str) => {
                const decoded = str.replace("&amp;#8217;", "'");
                return decoded;
            }

            const selectElement = (selector, handler) => {
                const element = document.querySelector('#presearch-daysOfTheYear-package ' + selector);
                return handler(element);
            };

            const enumerateElements = (selector, handler) => {
                const elements = document.querySelectorAll('#presearch-daysOfTheYear-package ' + selector);
                elements.forEach((element, index) => handler(element, index));
            };

            const selectDay = (index) => {
                selectedDay = data[index];

                selectElement('button[data-day].active', (btn)=> btn?.classList.remove('active'));
                selectElement('button[data-day="' + index + '"]', (btn)=> btn?.classList.add('active'));
                selectElement('.day-date', (el)=> {
                    el.innerText = selectedDay.date;
                });

                selectElement('.day-tags', (element)=> {
                    const html = selectedDay.data.map((day, index) => {
                        return '<button data-dayevent="' + index + '" class="day-tag ' + (!index ? 'active' : '') + '">' + decodedString(day.name) + '</button>';
                    }).join('');

                    element.innerHTML = html;
                });

                selectEvent(0);
            };

            const selectEvent = (index) => {
                const dayEvent = selectedDay.data[index];

                selectElement('button[data-dayevent].active', (btn)=> btn?.classList.remove('active'));
                selectElement('button[data-dayevent="' + index + '"]', (btn)=> btn?.classList.add('active'));

                selectElement('.day-name a', (item)=> { 
                    item.innerText = decodedString(dayEvent.name);
                    item.href = dayEvent.url;
                });
                selectElement('.day-description', (item)=> item.innerHTML = dayEvent.description);
            };

            enumerateElements('button[data-day]', (btn) => {
                btn.addEventListener('click', (e)=> {
                    const dayIndex = parseInt(btn.dataset.day);
                    selectDay(dayIndex);
                });
            });

            selectElement('.day-tags', (element)=> {
                element.addEventListener('click', (e)=> {
                    const eventIndex = parseInt(e.target.dataset.dayevent);

                    if (!isNaN(eventIndex)) {
                        selectEvent(eventIndex);
                    }
                });
            });

            selectDay(0);
        })();
    </script>

    <style>
        #presearch-daysOfTheYear-package {
            color: #1f2937;
            cursor: default;
        }

        .dark #presearch-daysOfTheYear-package {
            color: #ced5e2;
        }

        #presearch-daysOfTheYear-package .header {
            padding-bottom: 10px;
            border-bottom: 2px solid #e4e4e4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 5px;
        }

        #presearch-daysOfTheYear-package .header .day-date {
            font-size: 22px;
        }

        .dark #presearch-daysOfTheYear-package .header {
            border-bottom: 2px solid #3d3e40;
        }

        #presearch-daysOfTheYear-package button[data-day] {
            padding: 8px 16px;
            border-radius: 10px;
            background-color: transparent;
        }

        #presearch-daysOfTheYear-package button[data-day].active {
            background-color: #dddddd;
        }
        
        .dark #presearch-daysOfTheYear-package button[data-day].active {
            background-color: #3d3e40;
        }

        #presearch-daysOfTheYear-package a:hover {
            color: #71a7ff;
            cursor: pointer;
        }

        #presearch-daysOfTheYear-package .day-name {
            font-size: 22px;
            border-bottom: 2px solid #e4e4e4;
            padding: 10px 0;
        }

        .dark #presearch-daysOfTheYear-package .day-name {
            border-bottom: 2px solid #3d3e40;
        }

        #presearch-daysOfTheYear-package .day-description {
            font-size: 16px;
            padding: 10px 0;
        }

        #presearch-daysOfTheYear-package .day-tag {
            background-color: #dddddd;
            padding: 5px 15px;
            margin: 3px 6px 3px 0px;
            border-radius: 10px;
            text-align: left;
        }

        .dark #presearch-daysOfTheYear-package .day-tag {
            background-color: #3d3e40;
        }

        #presearch-daysOfTheYear-package .day-tag:hover,
        #presearch-daysOfTheYear-package .day-tag.active {
            background-color: #8e8e8e;
            color: white;
            cursor: pointer;
        }

        .dark #presearch-daysOfTheYear-package .day-tag:hover,
        .dark #presearch-daysOfTheYear-package .day-tag.active {
            background-color: #595c62;
        }

        #presearch-daysOfTheYear-package .day-tags {
            display: flex;
            flex-wrap: wrap;
        }

        #presearch-daysOfTheYear-package .powered-by {
            text-align: right;
        }
    </style> 
    `;
}

async function getMemorableDays(API_KEY) {

    const escapeHtml = (unsafe) => {
        return unsafe.replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;')
            .replaceAll("\n", '<br />')
            .replaceAll("–", '-')
            .replaceAll("’", '\'');
    }

    const toContract = async (day, data) => {
        const dayName = day.isSame(dayjs(), 'day')
            ? "Today" : day.isSame(dayjs().add(1, 'day'), 'day')
                ? "Tomorrow" : day.format('MMM D');

        return {
            date: day.format('dddd, MMMM D'),
            name: dayName,
            data: data.data.map(d => ({
                name: escapeHtml(d.name),
                description: escapeHtml(d.excerpt),
                url: d.url
            }))
        };
    };

    try {
        const daysToFetch = Array.from(Array(3).keys()).map((index)=> dayjs().add(index, 'day'));

        const promises = daysToFetch.map(async day => {
            const url = `${DAYS_API_URL}date/${day.format('YYYY/MM/DD/')}`;
            const { data } = await axios.get(url,
                {
                    headers: {
                        'X-Api-Key': API_KEY
                    }
                }
            );
            return toContract(day, data);
        });

        return await Promise.all(promises);
    }
    catch (error) {
        return { error };
    }
}

async function trigger(query) {
    query = (query || "").toLowerCase();
    const triggers = [/day(s?) of the year/, /what to celebrate/, /today/];
    return triggers.some(t => t.test(query));
}

module.exports = { daysOfTheYear, trigger };