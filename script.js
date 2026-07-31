const anggota = [

{
id:"KKN001",
nama:"Harika Adi Alfath",
nim:"2370201024",
prodi:"Ilmu Komunikasi"
},

{
id:"KKN002",
nama:"M. Ramadan Ilham",
nim:"2355201251",
prodi:"Teknik Informatika"
},

{
id:"KKN003",
nama:"Randi Surahman",
nim:"2370201059",
prodi:"Ilmu Komunikasi"
},

{
id:"KKN004",
nama:"Fajar Mohamad Indra",
nim:"2355201197",
prodi:"Teknik Informatika"
},

{
id:"KKN005",
nama:"Kesi Dwi Anggraini",
nim:"2387203001",
prodi:"Pendidikan Ekonomi"
},

{
id:"KKN006",
nama:"Tiara Anjellina Putri",
nim:"2362201035",
prodi:"Akuntansi"
},

{
id:"KKN007",
nama:"Flora Dwi Putri",
nim:"2361201021",
prodi:"Manajemen"
},

{
id:"KKN008",
nama:"Nayla Sabella",
nim:"2355201256",
prodi:"Teknik Informatika"
},

{
id:"KKN009",
nama:"Dhifa Aura Chantika",
nim:"2361201164",
prodi:"Manajemen"
},

{
id:"KKN010",
nama:"Faiz Alghofar",
nim:"2474201184P",
prodi:"Ilmu Hukum"
},

{
id:"KKN011",
nama:"Elgi Rahmadani",
nim:"2361201163",
prodi:"Manajemen"
}

];
const mulai = document.getElementById("mulai");

const home = document.getElementById("home");

const login = document.getElementById("login");

const dashboard = document.getElementById("dashboard");
let html5QrCode;

let rekap = JSON.parse(localStorage.getItem("rekap")) || [];
mulai.addEventListener("click",function(){

home.style.display="none";

login.style.display="block";

});

document.getElementById("loginBtn").addEventListener("click",function(){

const username=document.getElementById("username").value;

const password=document.getElementById("password").value;

const akun = [
  {
    username: "Sekretaris",
    password: "Flora29",
    role: "Admin"
  }
];

const user = akun.find(
  item => item.username === username && item.password === password
);

if (user) {

  const role = user.role;

  document.getElementById("home").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("roleAdmin").innerHTML =
    "👤 Role : " + role;

} else {

  alert("Username atau Password salah");
}
});

document.getElementById("logout").addEventListener("click", function(){

document.getElementById("dashboard").style.display = "none";

home.style.display = "block";

});
document.getElementById("scan").addEventListener("click", function(){

dashboard.style.display = "none";

document.getElementById("scanPage").style.display = "block";
html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
{ facingMode: "environment" },
{
fps: 10,
qrbox: 250
},
function(decodedText){

const data = anggota.find(function(item){

return item.id === decodedText;

});

if(data){
const sekarang = new Date();

const tanggal = sekarang.toLocaleDateString("id-ID");
  const jam = sekarang.toLocaleTimeString("id-ID");

const sudahAbsen = rekap.find(function(item){

return item.id === data.id && item.tanggal === tanggal;

});
if(sudahAbsen){

document.getElementById("hasilScan").innerHTML = `
<h3>⚠️ Sudah Absen</h3>

<p>${data.nama} sudah melakukan absensi hari ini.</p>
`;

}else{

rekap.push({

id: data.id,
nama: data.nama,
nim: data.nim,
prodi: data.prodi,
tanggal: tanggal,
jam: jam,
status: "Hadir"

});

localStorage.setItem("rekap", JSON.stringify(rekap));
fetch("https://script.google.com/macros/s/AKfycbxQddxAzPHFoVngaS4_okz4vbTJEi0vmeNzTMmBmBA-R-UmAjMqxwJuu75Rq5XQF10NfQ/exec",{

method:"POST",

body:JSON.stringify({

nama:data.nama,

nim:data.nim,

prodi:data.prodi,

tanggal:tanggal,

jam:jam,

status:"Hadir"

})

})
.then(function(){

console.log("Data berhasil dikirim ke Google Sheets");

})
.catch(function(error){

console.log(error);

}); 
document.getElementById("hasilScan").innerHTML = `
<h3>✅ Absensi Berhasil</h3>

<p><b>Nama :</b> ${data.nama}</p>

<p><b>NIM :</b> ${data.nim}</p>

<p><b>Prodi :</b> ${data.prodi}</p>

<p><b>Jam :</b> ${jam}</p>

`;

}

}else{

document.getElementById("hasilScan").innerHTML =
"❌ QR Code tidak terdaftar";

}

},
function(error){}

);
});
document.getElementById("kembaliScan").addEventListener("click", function(){

if(html5QrCode){

html5QrCode.stop().then(function(){

document.getElementById("scanPage").style.display = "none";

dashboard.style.display = "block";

});

}else{

document.getElementById("scanPage").style.display = "none";

dashboard.style.display = "block";

}

});
document.getElementById("anggota").addEventListener("click", function(){

dashboard.style.display = "none";

document.getElementById("dataAnggota").style.display = "block";

const list = document.getElementById("listAnggota");

list.innerHTML = "";

anggota.forEach(function(item){

list.innerHTML += `
<div class="card">

<b>${item.id}</b>

<h3>${item.nama}</h3>

<p>🎓 ${item.prodi}</p>

<p>🆔 ${item.nim}</p>

</div>
`;

});

});
document.getElementById("kembaliDashboard").addEventListener("click", function(){

document.getElementById("dataAnggota").style.display = "none";

document.getElementById("dashboard").style.display = "block";

});
// =====================
// REKAP KEHADIRAN
// =====================

document.getElementById("rekap").addEventListener("click", function(){

dashboard.style.display = "none";
document.getElementById("rekapPage").style.display = "block";

const rekapList = document.getElementById("rekapList");

rekapList.innerHTML = "";

if(rekap.length === 0){

rekapList.innerHTML = "<p>Belum ada data absensi.</p>";

}else{

rekap.forEach(function(item){

rekapList.innerHTML += `
<div class="card">
<h3>${item.nama}</h3>

<p>🆔 ${item.nim}</p>

<p>🎓 ${item.prodi}</p>

<p>📅 ${item.tanggal}</p>

<p>🕒 ${item.jam}</p>

<p>✅ ${item.status}</p>
</div>
`;

});

}

});

document.getElementById("kembaliRekap").addEventListener("click", function(){

document.getElementById("rekapPage").style.display="none";

dashboard.style.display="block";

});
// =====================
// PENCARIAN ANGGOTA
// =====================

document.getElementById("cariAnggota").addEventListener("keyup", function(){

const keyword = this.value.toLowerCase();

const cards = document.querySelectorAll("#listAnggota .card");

cards.forEach(function(card){

if(card.innerText.toLowerCase().includes(keyword)){

card.style.display = "block";

}else{

card.style.display = "none";

}

});

});
// =====================
// GENERATE QR PAGE
// =====================

document.getElementById("generateQR").addEventListener("click", function(){

dashboard.style.display = "none";

document.getElementById("generateQRPage").style.display = "block";

const qrContainer = document.getElementById("qrContainer");

qrContainer.innerHTML = "";

anggota.forEach(function(item){

const card = document.createElement("div");

card.className = "card";

const qrDiv = document.createElement("div");

card.appendChild(qrDiv);

new QRCode(qrDiv,{

text:item.id,
width:180,
height:180

});

const info = document.createElement("div");

info.innerHTML = `
<h3>${item.nama}</h3>

<p>${item.nim}</p>

<p><b>${item.id}</b></p>

<button class="downloadQR">⬇️ Download QR</button>
`;

card.appendChild(info);
const tombol = info.querySelector(".downloadQR");

tombol.addEventListener("click", function () {

  const canvas = qrDiv.querySelector("canvas");

  const link = document.createElement("a");

  link.href = canvas.toDataURL("image/png");

  link.download = item.nama.replace(/\s+/g, "_") + "_QR.png";

  link.click();

});
qrContainer.appendChild(card);

});

});
document.getElementById("kembaliGenerate").addEventListener("click",function(){

document.getElementById("generateQRPage").style.display="none";

dashboard.style.display="block";

});
// =====================
// EXPORT EXCEL (CSV)
// =====================

document.getElementById("exportExcel").addEventListener("click", function(){

if(rekap.length === 0){

alert("Belum ada data absensi.");

return;

}

let csv = "Nama,NIM,Prodi,Tanggal,Jam,Status\n";

rekap.forEach(function(item){

csv += `${item.nama},${item.nim},${item.prodi},${item.tanggal},${item.jam},${item.status}\n`;

});

const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});

const link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = "Rekap_Absensi_KKN.csv";

link.click();

});
document.getElementById("downloadPDF").addEventListener("click", function () {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("QR CODE ABSENSI KKN", 20, 20);

    let y = 35;

    const cards = document.querySelectorAll("#qrContainer .card");

    cards.forEach((card, index) => {

        const canvas = card.querySelector("canvas");

        if (!canvas) return;

        const imgData = canvas.toDataURL("image/png");

        const nama = card.querySelector("h3").innerText;
        const nim = card.querySelectorAll("p")[0].innerText;
        const id = card.querySelectorAll("p")[1].innerText;

        doc.addImage(imgData, "PNG", 15, y, 35, 35);

        doc.setFontSize(12);
        doc.text(nama, 60, y + 10);
        doc.text(nim, 60, y + 18);
        doc.text(id, 60, y + 26);

        y += 50;

        if (y > 250 && index < cards.length - 1) {
            doc.addPage();
            y = 20;
        }

    });

    doc.save("QR_KKN_Kelompok49.pdf");

});