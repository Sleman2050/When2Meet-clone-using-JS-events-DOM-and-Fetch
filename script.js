const startTimeSelect = document.getElementById('start-time');
const endTimeSelect = document.getElementById('end-time');
const timeTableContainer = document.getElementById('timeTable');
const submitMeetingButton = document.getElementById('submitMeeting');
const userNameInput = document.getElementById('user-name');
const eventNameInput = document.getElementById('event-name');
const defaultStartHour = 8;
const defaultEndHour = 17;

function populateDropdownMenu(selectElement, selectedValue) {

    for (let hour = 0; hour < 24; hour++) {

        const formattedHour = formatHour(hour);

        const option = document.createElement('option');

        option.text = formattedHour;

        option.value = hour;

        option.selected = hour === selectedValue;

        selectElement.appendChild(option);

    }
}

function formatHour(hour) {

    const hourIn12Format = hour % 12 === 0 ? 12 : hour % 12;

    const period = hour < 12 ? 'AM' : 'PM';

    return `${hourIn12Format}:00 ${period}`;

}

function updateSelectedHours() {

    const startHour = parseInt(startTimeSelect.value);

    const endHour = parseInt(endTimeSelect.value);
    
 
    if (startHour < endHour) {

        createTimeTable(startHour, endHour);

    } 
    
    else {

        timeTableContainer.innerHTML = ""; 

    }
}

startTimeSelect.addEventListener('change', updateSelectedHours);

endTimeSelect.addEventListener('change', updateSelectedHours);

function createTimeTable(startHour, endHour) {

    const tableHtml = [];

    tableHtml.push('<table><thead><tr><th></th>');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    days.forEach(day => tableHtml.push(`<th class="day-header">${day}</th>`));
    tableHtml.push('</tr></thead><tbody>');

    for (let hour = startHour; hour < endHour; hour++) {

        const formattedHour = formatHour(hour);

        tableHtml.push(`<tr><td class="time-label">${formattedHour}</td>`);

        days.forEach(day => {
            const timeSlotId = `${day}-${formattedHour}`;
            const isSelected = selectedTimeSlots.has(timeSlotId);

            tableHtml.push(`
                <td class="time-slot" 
                    data-day="${day}" 
                    data-time="${formattedHour}"
                    onclick="updateSlotSelection(this)"
                    ${isSelected ? 'class="selected"' : ''}
                >
                </td>
            `);
        });

        tableHtml.push('</tr>');
    }

    tableHtml.push('</tbody></table>');

    timeTableContainer.innerHTML = tableHtml.join('');
}


const selectedTimeSlots = new Set();


populateDropdownMenu(startTimeSelect, defaultStartHour);

populateDropdownMenu(endTimeSelect, defaultEndHour);


createTimeTable(defaultStartHour, defaultEndHour);

function updateSlotSelection(timeSlotElement) {

    const timeSlotId = `${timeSlotElement.dataset.day}-${timeSlotElement.dataset.time}`;

    if (selectedTimeSlots.has(timeSlotId)) {

        selectedTimeSlots.delete(timeSlotId);

        timeSlotElement.classList.remove('selected');
    } 
    
    else {
        selectedTimeSlots.add(timeSlotId);

        timeSlotElement.classList.add('selected');
    }
}

submitMeetingButton.addEventListener('click', async function () {

    const userName = userNameInput.value;

    const eventName = eventNameInput.value;

    if (!userName || !eventName) {

        alert('Please enter your name and the event name');
        return;

    }

    const bodyPayload = {

        username: userName,

        eventName: eventName,

        slots: [...selectedTimeSlots],
    
    };

    const API_URL = 'https://jsonplaceholder.typicode.com/posts';

    try {


        const response = await fetch(API_URL, {

            method: 'POST',
            body: JSON.stringify(bodyPayload),
            headers: {'Content-type': 'application/json',},

        });

        
        const data = await response.json();

        console.log(data);


    } 
    
    catch (error) {

        console.error('Error:', error);

    }


});


createTimeTable(defaultStartHour, defaultEndHour);