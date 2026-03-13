let currentDate = new Date();

async function loadCalendar(){

const res = await fetch("data/calendar.json");
const data = await res.json();

const holidays = await fetch(
"https://holidays-jp.github.io/api/v1/date.json"
).then(r=>r.json());

const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const year = currentDate.getFullYear();
const month = currentDate.getMonth();

monthLabel.innerText = `${months[month]} ${year}`;

const firstDay = new Date(year,month,1);
const lastDay = new Date(year,month+1,0);

const startWeek = firstDay.getDay();

let html="";
let day=1;

for(let i=0;i<42;i++){

if(i<startWeek || day>lastDay.getDate()){
html+=`<div class="day empty"></div>`;
continue;
}

const dateStr=`${year}/${String(month+1).padStart(2,"0")}/${String(day).padStart(2,"0")}`;

const items=data.filter(d=>d.date===dateStr);

let cards="";

items.forEach(item=>{

let typeClass="";

if(item.type==="ZENN") typeClass="zenn";
if(item.type==="NOTE") typeClass="note";
if(item.type==="登壇") typeClass="talk";

let image=item.image || "";

let imgTag=image?`<img src="${image}">`:"";

if(item.url){

cards+=`
<a class="event ${typeClass}" href="${item.url}" target="_blank">
${imgTag}
${item.title}
<div class="author">${item.author}</div>
</a>
`;

}else{

cards+=`
<div class="event ${typeClass}">
${imgTag}
${item.title}
<div class="author">${item.author}</div>
</div>
`;

}

});

let holidayLabel="";

if(holidays[dateStr]){
holidayLabel=`<div class="holiday">${holidays[dateStr]}</div>`;
}

html+=`

<div class="day">

<div class="date">${day}</div>

${holidayLabel}

<div class="events">

${cards}

</div>

</div>

`;

day++;

}

calendar.innerHTML=html;

}

function prevMonth(){

currentDate.setMonth(currentDate.getMonth()-1);
loadCalendar();

}

function nextMonth(){

currentDate.setMonth(currentDate.getMonth()+1);
loadCalendar();

}

loadCalendar();
