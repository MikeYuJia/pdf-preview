const params = new URL(document.location).searchParams;
const key = params.get('file')

init();

function getList() {
    return fetch(`/mark/list?key=${key}`).then(res => {
        return res.json()
    });
}

function init() {
    const contaienr = document.createElement('div');
    contaienr.innerHTML = `
    <div class="title">笔记<div data-event="showAddNotesDialog" class="add-notes"></div></div>
    <div class="content"></div>
    `
    contaienr.className = 'notes-list';
    document.body.appendChild(contaienr);

    const css = document.createElement('style');
    css.innerHTML = `
    .notes-list {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 400px;
        padding: 32px 10px 10px;
        transform: translateX(100%);
        transition: transform 0.3s;
        z-index: 3;
        color: #fff;
        box-sizing: border-box;
        background: var(--doorhanger-bg-color);
        box-shadow: 0 1px 5px var(--doorhanger-border-color), 0 0 0 1px var(--doorhanger-border-color);
    }

    .show-notes{
        transform: translateX(0);
    }

    .notes-list .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
    }

    .notes-list .add-notes {
        width: 20px;
        height: 20px;
        background: var(--add-button-icon);
        background-repeat: no-repeat;
        background-size: 100%;
        cursor: pointer;
    }

    .notes-list .content {
        flex: 1;
        overflow: auto;
    }

    .notes-item {
        width: 100%;
        padding: 10px 10px 10px 0;
    }
    .notes-add-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 300px;
        padding-bottom: 30px;
        background: #fff;
        z-index: 9;
        box-shadow: 0 1px 5px var(--doorhanger-border-color), 0 0 0 1px var(--doorhanger-border-color);
    }
    .notes-add-dialog textarea {
        width: 100%;
        height: 100%;
        resize: none;
        border: none;
        outline: none;
    }
    .notes-add-dialog textarea:active {
        border: none;
    }
    .line-button {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
    }

    .notes-button {
        cursor: pointer;
    }
    .notes-button + .notes-button {
        margin-left: 10px;
    }
    `
    document.body.appendChild(css);
    initEvent();
    refreshList();
}

const methods = {
    showAddNotesDialog() {
        const dialog = document.createElement('div');
        dialog.innerHTML = `
        <textarea placeholder="请输入内容"></textarea>
        <div class="line-button">
            <div id="cancelDialog" class="notes-button" data-event="cancelDialog">取消</div>
            <div id="addNotes" class="notes-button" data-event="addNotes">确定</div>
        </div>
        `
        dialog.className = 'notes-add-dialog';
        document.body.appendChild(dialog);
    },
    addNotes() {
        const content = document.querySelector('.notes-add-dialog textarea').value;
        document.querySelector('.notes-add-dialog').remove();
        if (!content.trim()) {
            return;
        }
        fetch('/mark/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                key,
                content
            })
        }).then(() => {
            refreshList();
        });
        console.log('content: ', content)
    },
    cancelDialog() {
        document.querySelector('.notes-add-dialog').remove();
    }
}

function refreshList() {
    getList().then(res => {
        renderMark(res.list);
    });
}

function initEvent() {
    document.querySelector('#editorOpenNotes').addEventListener('click', toggleNotes);
    document.body.addEventListener('click', onClickNotes);
    
}

function onClickNotes(e) {
    if (methods[e.srcElement.dataset['event']]) {
        methods[e.srcElement.dataset['event']]();
    }
}

function toggleNotes() {
    const list = document.querySelector('.notes-list');
    if (list.classList.contains('show-notes')) {
      list.classList.remove('show-notes');
    } else {
      list.classList.add('show-notes');
    }
}


function renderMark(list) {
    const content = document.querySelector('.notes-list .content');
    let str = '';

    list.forEach(item => {
        str += `
            <div data-id="${item.id}" class="notes-item">${item.content}</div>
        `
    });
    content.innerHTML = str;
}