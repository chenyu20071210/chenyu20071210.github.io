let num = 3;
let count = 0;
let selectedDisk = null;
let selectedPeg = null;
let isAutoSolving = false;

const aPeg = document.getElementById('a');
const bPeg = document.getElementById('b');
const cPeg = document.getElementById('c');
const diskCountInput = document.getElementById('num');
const resetBtn = document.getElementById('reset');
const autoSolveBtn = document.getElementById('auto');
const moveCounter = document.getElementById('count');
const warnText = document.getElementById('warn');

function init() {
    count = 0;
    moveCounter.innerText = count;
    selectedDisk = null;
    selectedPeg = null;
    isAutoSolving = false;
    warnText.innerText = '';

    aPeg.innerHTML = '';
    bPeg.innerHTML = '';
    cPeg.innerHTML = '';

    num = parseInt(diskCountInput.value);
    if (num < 3) num = 3;
    if (num > 8) num = 8;
    diskCountInput.value = num;

    for (let i = num; i >= 1; i--) {
        let disk = document.createElement('div');
        disk.className = `disk d${i}`;
        disk.dataset.size = i;
        aPeg.appendChild(disk);
    }

    addClickEvents();
}

function addClickEvents() {
    document.querySelectorAll('.disk').forEach(disk => {
        disk.onclick = function() {
            if (isAutoSolving) return;
            const peg = this.parentElement;
            if (this === peg.lastElementChild) {
                document.querySelectorAll('.disk').forEach(d => d.style.transform = '');
                this.style.transform = 'translateY(-10px)';
                selectedDisk = this;
                selectedPeg = peg;
            }
        };
    });

    [aPeg, bPeg, cPeg].forEach(peg => {
        peg.onclick = function(e) {
            if (isAutoSolving) return;
            if (selectedDisk && this !== selectedPeg) {
                moveDisk(selectedDisk, selectedPeg, this);
            }
        };
    });
}

function moveDisk(disk, fromPeg, toPeg) {
    const diskSize = parseInt(disk.dataset.size);
    const topDisk = toPeg.lastElementChild;

    if (!topDisk || parseInt(topDisk.dataset.size) > diskSize) {
        toPeg.appendChild(disk);
        disk.style.transform = '';
        count++;
        moveCounter.innerText = count;
        warnText.innerText = '';
        checkWin();
    } else {
        warnText.innerText = '⚠️ 不能把大盘子放到小盘子上！';
        warnText.style.color = 'red';
        disk.style.transform = '';
    }
    selectedDisk = null;
    selectedPeg = null;
}

function checkWin() {
    if (cPeg.children.length === num) {
        setTimeout(() => {
            alert(`🎉 恭喜通关！你用了 ${count} 步！`);
        }, 300);
    }
}

function moveDiskAuto(fromPeg, toPeg) {
    return new Promise(resolve => {
        setTimeout(() => {
            const disk = fromPeg.lastElementChild;
            if (disk) {
                toPeg.appendChild(disk);
                count++;
                moveCounter.innerText = count;
            }
            resolve();
        }, 600);
    });
}

async function autoSolve(n, from, aux, to) {
    if (n === 0 || !isAutoSolving) return;
    await autoSolve(n - 1, from, to, aux);
    if (!isAutoSolving) return;
    await moveDiskAuto(from, to);
    await autoSolve(n - 1, aux, from, to);
}

autoSolveBtn.onclick = async function() {
    if (isAutoSolving) return;
    init();
    isAutoSolving = true;
    resetBtn.disabled = true;
    diskCountInput.disabled = true;
    autoSolveBtn.disabled = true;
    warnText.innerText = '🔄 自动通关中...';
    warnText.style.color = '#333';

    await autoSolve(num, aPeg, bPeg, cPeg);

    isAutoSolving = false;
    resetBtn.disabled = false;
    diskCountInput.disabled = false;
    autoSolveBtn.disabled = false;
    warnText.innerText = '✅ 自动通关完成！';
    checkWin();
};

resetBtn.onclick = init;
window.onload = init;