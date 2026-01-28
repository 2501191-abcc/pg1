//保存する関数
function saveData()
{
    let price = document.getElementById("inputPrice").value;
    let details = document.getElementById("details").value;

    //入力無しなら保存しない
    if (price == "" || details == "")
    {
        alert("金額と詳細を入力してください");
        return;
    }

    //保存するデータ
    let record = {
        price: Number(price),
        details: details,
        date: new Date().toISOString()
    };

    let records = localStorage.getItem("records");

    //データがあれば配列に変換、なければ空を用意
    if (records) {
        records = JSON.parse(records);
    } else {
        records = [];
    }

    records.push(record);

    localStorage.setItem("records", JSON.stringify(records));

    alert("保存しました");

    displayRecords();

    //入力欄をクリア
    document.getElementById("inputPrice").value = "";
    document.getElementById("details").value = "";
}

//表示、消去する関数
function displayRecords()
{
    let recordList = document.getElementById("recordList");
    recordList.innerHTML = "";

    let records = localStorage.getItem("records");
    if(!records) return;

    records = JSON.parse(records);

    //配列を逆順に表示
    for(let i = records.length - 1; i >= 0; i--){
        let record = records[i];

        //月と日を取得
        let newDate = new Date(record.date);
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();

        let recordDiv = document.createElement("div");
        recordDiv.className = "recordStyle";
        recordDiv.style.display = "flex";
        recordDiv.style.alignItems = "center";
        recordDiv.style.gap = "15px";
        
        let dateSpan = document.createElement("span");
        dateSpan.textContent = month + "/" + day;

        let detailSpan = document.createElement("span");
        detailSpan.textContent = record.details;
        detailSpan.style.maxWidth = "120px";
        detailSpan.style.fontSize = "12px";

        let priceSpan = document.createElement("span");
        let price = record.price;
        //1万円をこえると二行にする（レイアウトを崩れにくくするため）
        if(price >= 10000)
        {
            let thousand = Math.floor(price / 10000);
            let remainder = price % 10000;

            if(remainder > 0)
            {
                priceSpan.innerHTML = thousand + "万<br>" + remainder + "円"; 
            }
            else
            {
                priceSpan.innerHTML = thousand + "万";
            }
        }
        else
        {
            priceSpan.innerHTML = price + "円";
        }

        //消去ボタン
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "deleteButton";
        deleteBtn.textContent = "削除";

        deleteBtn.onclick = function(){
            records.splice(i, 1);
            localStorage.setItem("records", JSON.stringify(records));
            displayRecords();
        };
        
        //追加する
        recordDiv.appendChild(dateSpan);
        recordDiv.appendChild(detailSpan);
        recordDiv.appendChild(priceSpan);
        //金額を右寄せ
        priceSpan.style.marginLeft = "auto";
        recordDiv.appendChild(deleteBtn);
        recordList.appendChild(recordDiv);
    }
    total();
}

//三桁ずつに,を付ける関数
function formatYen(yen)
{
    return yen.toLocaleString();
}

//合計を表示する関数
function total()
{
    let total = 0;
    let records = localStorage.getItem("records");
    if (!records) return;

    records = JSON.parse(records);

    //今の年と月を取得
    let now = new Date();
    let thisYear = now.getFullYear();
    let thisMonth = now.getMonth();

    //今月かチェックし、今月だと合計していく
    for (let i = 0; i < records.length; i++)
    {
        let record = records[i];
        let recordDate = new Date(record.date);

        let recordYear = recordDate.getFullYear();
        let recordMonth = recordDate.getMonth();

        if (recordYear == thisYear &&  recordMonth == thisMonth)
        {
            total = total + record.price;
        }
    }
    let monthlyTotal = document.getElementById("monthlyTotal");
    monthlyTotal.textContent = "今月の合計： " + formatYen(total) + "円";
}

window.onload = displayRecords;