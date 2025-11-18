// ==========================================
// ส่วนที่ 1: ตัวแปรและการจัดการสถานะ
// ==========================================

// ตัวแปรเก็บว่าใครกำลังใช้งานอยู่ (เริ่มต้นยังไม่มีใคร = null)
let currentUser = null; 

// อ้างอิง Element ต่างๆ ในหน้าเว็บมาเก็บไว้ในตัวแปร
const loginPage = document.getElementById("login-page");
const todoPage = document.getElementById("todo-page");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// ==========================================
// ส่วนที่ 2: ฟังก์ชันจัดการระบบ Login / Logout
// ==========================================

function checkLogin() {
    const userIn = usernameInput.value;
    const passIn = passwordInput.value;

    // ตรวจสอบว่า usersDB มีอยู่จริงไหม (เผื่อลืมสร้างไฟล์ users.js)
    if (typeof usersDB === 'undefined') {
        alert("ไม่พบฐานข้อมูลผู้ใช้! กรุณาตรวจสอบว่าเชื่อมต่อไฟล์ users.js หรือยัง");
        return;
    }

    // ค้นหา user ใน usersDB
    const foundUser = usersDB.find(u => u.username === userIn && u.password === passIn);

    if (foundUser) {
        // 1. จำชื่อคนล็อกอิน
        currentUser = foundUser.username;
        
        alert("ยินดีต้อนรับคุณ " + currentUser + " !");
        
        // 2. สลับหน้าจอ: ซ่อน Login -> โชว์ To-Do
        loginPage.style.display = "none";
        todoPage.style.display = "block";
        
        // 3. โหลดข้อมูลของคนคนนี้ขึ้นมา
        loadData();
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!");
    }
}

function logout() {
    // เคลียร์ค่าคนใช้งานปัจจุบัน
    currentUser = null;
    
    // เคลียร์หน้าจอรายการทิ้ง (เพื่อไม่ให้คนต่อไปมาเห็น)
    listContainer.innerHTML = ""; 

    // สลับหน้ากลับไป Login
    todoPage.style.display = "none";
    loginPage.style.display = "block";
    
    // เคลียร์ช่องกรอกรหัสผ่านให้ว่างเปล่า
    usernameInput.value = "";
    passwordInput.value = "";
}

// ==========================================
// ส่วนที่ 3: ฟังก์ชันจัดการ To-Do List
// ==========================================

function addTask() {
    if (inputBox.value === '') {
        alert("กรุณาพิมพ์ข้อความก่อนกดเพิ่ม!");
    } else {
        // สร้างรายการใหม่ (li)
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        
        // สร้างปุ่มกากบาท (span)
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.className = "close";
        li.appendChild(span);
    }
    // เคลียร์ช่องพิมพ์
    inputBox.value = "";
    
    // บันทึกข้อมูลทันทีที่เพิ่มเสร็จ
    saveData(); 
}

// ดักจับเหตุการณ์คลิกที่รายการ (เพื่อติ๊กถูก หรือ ลบ)
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        // ถ้าคลิกที่ข้อความ -> สลับสถานะขีดฆ่า
        e.target.classList.toggle("checked");
        saveData(); // สถานะเปลี่ยนก็ต้องบันทึก
    } else if (e.target.tagName === "SPAN") {
        // ถ้าคลิกที่กากบาท -> ลบทิ้ง
        e.target.parentElement.remove();
        saveData(); // ลบแล้วก็ต้องบันทึก
    }
}, false);

// ==========================================
// ส่วนที่ 4: ระบบบันทึกและโหลดข้อมูล (หัวใจสำคัญ)
// ==========================================

function saveData() {
    if (currentUser) {
        // บันทึกข้อมูลลง LocalStorage โดยใช้ชื่อไฟล์แปะตามชื่อ user
        // เช่น data_admin, data_mario
        localStorage.setItem("data_" + currentUser, listContainer.innerHTML);
    }
}

function loadData() {
    if (currentUser) {
        // ดึงข้อมูลตามชื่อคนล็อกอิน
        const data = localStorage.getItem("data_" + currentUser);
        
        if (data) {
            // ถ้ามีของเก่า เอามาแสดง
            listContainer.innerHTML = data;
        } else {
            // ถ้าไม่มี (เพิ่งสมัครใหม่) เคลียร์ให้ว่าง
            listContainer.innerHTML = "";
        }
    }
}

// ==========================================
// ส่วนที่ 5: ลูกเล่นเพิ่มเติม (กด Enter)
// ==========================================

// กด Enter ที่ช่องรหัสผ่าน เพื่อ Login
passwordInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkLogin();
});

// กด Enter ที่ช่องพิมพ์งาน เพื่อ Add Task
inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") addTask();
});
