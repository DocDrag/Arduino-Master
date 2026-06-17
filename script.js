        let currentAnswer = "";
        let currentHint = "";
        let lastQuestionType = "";
        
        let scoreCorrect = 0;
        let scoreIncorrect = 0;
        let scoreSkipped = 0;
        let currentQuestionStatus = "unattempted";

        function finalizeCurrentQuestion() {
            if (currentQuestionStatus === "correct") {
                scoreCorrect++;
            } else if (currentQuestionStatus === "wrong") {
                scoreIncorrect++;
            } else if (currentQuestionStatus === "unattempted") {
                scoreSkipped++;
            }
            currentQuestionStatus = "completed";
            updateScoreUI();
        }

        function updateScoreUI() {
            document.getElementById("count-correct").innerText = scoreCorrect;
            document.getElementById("count-incorrect").innerText = scoreIncorrect;
            document.getElementById("count-skipped").innerText = scoreSkipped;
            
            const total = scoreCorrect + scoreIncorrect + scoreSkipped;
            if (total > 0) {
                document.getElementById("bar-correct").style.width = (scoreCorrect / total * 100) + "%";
                document.getElementById("bar-incorrect").style.width = (scoreIncorrect / total * 100) + "%";
                document.getElementById("bar-skipped").style.width = (scoreSkipped / total * 100) + "%";
            } else {
                document.getElementById("bar-correct").style.width = "0%";
                document.getElementById("bar-incorrect").style.width = "0%";
                document.getElementById("bar-skipped").style.width = "0%";
            }
        }

        const level1Types = [
            "setup", "loop", "serial_begin_serial", "serial_begin_begin", "delay"
        ];
        
        const level2Types = [
            "serial_print_serial", "serial_print_print",
            "serial_println_serial", "serial_println_println",
            "pinmode_cmd", "pinmode_mode", "digitalwrite_cmd", "digitalwrite_state"
        ];

        const level3Types = [
            "var_int", "var_float", "var_string", "var_bool", "var_char"
        ];

        function changeLevel() {
            const level = document.getElementById("level-select").value;
            const focusContainer = document.getElementById("focus-switch-container");
            const focusToggle = document.getElementById("focus-toggle");
            
            if (level === "1") {
                focusContainer.style.opacity = "0.3";
                focusToggle.disabled = true;
            } else {
                focusContainer.style.opacity = "1";
                focusToggle.disabled = false;
            }

            // รีเซ็ตคะแนนและเริ่มสุ่มข้อใหม่ของระดับนั้น
            scoreCorrect = 0;
            scoreIncorrect = 0;
            scoreSkipped = 0;
            currentQuestionStatus = "completed"; // ป้องกันการติดสถานะข้าม
            updateScoreUI();
            nextQuestion();
        }

        function generateRandomQuestion() {
            const level = document.getElementById("level-select").value;
            const isFocus = document.getElementById("focus-toggle").checked;
            
            let questionTypes = level1Types;
            if (level === "2") {
                if (isFocus) {
                    questionTypes = level2Types;
                } else {
                    questionTypes = level1Types.concat(level2Types);
                }
            } else if (level === "3") {
                if (isFocus) {
                    questionTypes = level3Types;
                } else {
                    questionTypes = level1Types.concat(level2Types, level3Types);
                }
            }
            
            let type;
            do {
                type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            } while (type === lastQuestionType && questionTypes.length > 1);
            
            lastQuestionType = type;
            
            // สุ่มขาพิน 2 ถึง 13 (ห้ามใช้ 0, 1)
            function getRandomPin() {
                return Math.floor(Math.random() * 12) + 2;
            }
            
            let template = "";
            let answer = "";
            let hint = "";
            
            switch (type) {
                case "setup":
                    template = "void __________() {\n  // ทำงานรอบเดียวตอนเปิดเครื่อง\n}\n\nvoid loop() {\n  // ทำงานวนซ้ำไปเรื่อยๆ\n}";
                    answer = "setup";
                    hint = "บล็อกตั้งค่าเริ่มต้น";
                    break;
                case "loop":
                    template = "void setup() {\n  // ทำงานรอบเดียวตอนเปิดเครื่อง\n}\n\nvoid __________() {\n  // ทำงานวนซ้ำไปเรื่อยๆ\n}";
                    answer = "loop";
                    hint = "บล็อกการทำงานหลัก";
                    break;
                case "serial_begin_serial":
                    template = "void setup() {\n  __________.begin(9600);\n}\n\nvoid loop() {\n  \n}";
                    answer = "Serial";
                    hint = "หน้าจอตรวจสอบอนุกรม (ขึ้นต้นด้วยตัวพิมพ์ใหญ่)";
                    break;
                case "serial_begin_begin":
                    template = "void setup() {\n  Serial.__________(9600);\n}\n\nvoid loop() {\n  \n}";
                    answer = "begin";
                    hint = "คำสั่งเปิดท่อสื่อสาร";
                    break;
                case "delay":
                    const ms = [100, 500, 1000, 2000, 5000][Math.floor(Math.random() * 5)];
                    template = "void setup() {\n  \n}\n\nvoid loop() {\n  __________(" + ms + ");\n}";
                    answer = "delay";
                    hint = "คำสั่งหน่วงเวลาเป็นมิลลิวินาที";
                    break;
                case "serial_print_serial":
                    template = "void setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  __________.print(\"Hello\");\n}";
                    answer = "Serial";
                    hint = "หน้าจอตรวจสอบอนุกรม (ขึ้นต้นด้วยตัวพิมพ์ใหญ่)";
                    break;
                case "serial_print_print":
                    template = "void setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  Serial.__________(\"Hello\");\n}";
                    answer = "print";
                    hint = "พิมพ์ข้อความออกจอ (ไม่ขึ้นบรรทัดใหม่)";
                    break;
                case "serial_println_serial":
                    template = "void setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  __________.println(\"World\");\n}";
                    answer = "Serial";
                    hint = "หน้าจอตรวจสอบอนุกรม (ขึ้นต้นด้วยตัวพิมพ์ใหญ่)";
                    break;
                case "serial_println_println":
                    template = "void setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  Serial.__________(\"World\");\n}";
                    answer = "println";
                    hint = "พิมพ์ข้อความออกจอ (พร้อมขึ้นบรรทัดใหม่)";
                    break;
                case "pinmode_cmd":
                    const pin1 = getRandomPin();
                    const modes1 = ["INPUT", "OUTPUT"];
                    const mode1 = modes1[Math.floor(Math.random() * modes1.length)];
                    template = "void setup() {\n  __________(" + pin1 + ", " + mode1 + ");\n}\n\nvoid loop() {\n  \n}";
                    answer = "pinMode";
                    hint = "คำสั่งตั้งค่าโหมดของขาพิน";
                    break;
                case "pinmode_mode":
                    const pin2 = getRandomPin();
                    const modes2 = ["INPUT", "OUTPUT"];
                    const mode2 = modes2[Math.floor(Math.random() * modes2.length)];
                    template = "void setup() {\n  pinMode(" + pin2 + ", __________);\n}\n\nvoid loop() {\n  \n}";
                    answer = mode2;
                    hint = mode2 === "INPUT" ? "ตั้งขาให้เป็นผู้รับสัญญาณ (พิมพ์ใหญ่ทั้งหมด)" : "ตั้งขาให้เป็นผู้จ่ายไฟออก (พิมพ์ใหญ่ทั้งหมด)";
                    break;
                case "digitalwrite_cmd":
                    const pin3 = getRandomPin();
                    const states1 = ["HIGH", "LOW"];
                    const state1 = states1[Math.floor(Math.random() * states1.length)];
                    template = "void setup() {\n  pinMode(" + pin3 + ", OUTPUT);\n}\n\nvoid loop() {\n  __________(" + pin3 + ", " + state1 + ");\n}";
                    answer = "digitalWrite";
                    hint = "คำสั่งสั่งจ่ายไฟหรือตัดไฟของขาดิจิทัล";
                    break;
                case "digitalwrite_state":
                    const pin4 = getRandomPin();
                    const states2 = ["HIGH", "LOW"];
                    const state2 = states2[Math.floor(Math.random() * states2.length)];
                    template = "void setup() {\n  pinMode(" + pin4 + ", OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(" + pin4 + ", __________);\n}";
                    answer = state2;
                    hint = state2 === "HIGH" ? "สั่งจ่ายไฟ 5V (พิมพ์ใหญ่ทั้งหมด)" : "สั่งตัดไฟ 0V (พิมพ์ใหญ่ทั้งหมด)";
                    break;
                case "var_int":
                    const numInt = Math.floor(Math.random() * 100);
                    template = "__________ score = " + numInt + ";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "int";
                    hint = "ชนิดตัวแปรเก็บค่าจำนวนเต็ม";
                    break;
                case "var_float":
                    const numFloat = (Math.random() * 100).toFixed(2);
                    template = "__________ temp = " + numFloat + ";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "float";
                    hint = "ชนิดตัวแปรเก็บค่าตัวเลขทศนิยม";
                    break;
                case "var_string":
                    template = "__________ name = \"Arduino\";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "String";
                    hint = "ชนิดตัวแปรเก็บข้อความยาวๆ (ตัวอักษรแรกพิมพ์ใหญ่)";
                    break;
                case "var_bool":
                    const boolVals = ["true", "false"];
                    const bVal = boolVals[Math.floor(Math.random() * 2)];
                    template = "__________ status = " + bVal + ";\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "bool";
                    hint = "ชนิดตัวแปรเก็บค่าความจริง (true หรือ false)";
                    break;
                case "var_char":
                    template = "__________ grade = 'A';\n\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}";
                    answer = "char";
                    hint = "ชนิดตัวแปรเก็บตัวอักษรเพียง 1 ตัว";
                    break;
            }
            return { template, answer, hint };
        }

        function nextQuestion() {
            if (currentAnswer !== "") {
                if (currentQuestionStatus !== "completed") {
                    finalizeCurrentQuestion();
                }
            }
            currentQuestionStatus = "unattempted";

            // สุ่มโจทย์ใหม่ไม่จำกัด
            const q = generateRandomQuestion();
            currentAnswer = q.answer;
            currentHint = q.hint;
            
            // แทนที่ช่องว่างด้วย Input Field
            const htmlCode = q.template.replace("__________", "<input type='text' id='userInput' autocomplete='off' onkeypress='handleEnter(event)'>");
            
            document.getElementById("code-display").innerHTML = htmlCode;
            document.getElementById("feedback").innerHTML = `<span style="color: #888; font-size: 0.9rem;">คำใบ้: ${currentHint}</span>`;
            
            // Auto Focus ที่ช่องเติมคำ
            setTimeout(() => document.getElementById("userInput").focus(), 100);
        }

        function checkAnswer() {
            if (currentQuestionStatus === "completed") return;

            const userInputEl = document.getElementById("userInput");
            const userVal = userInputEl.value.trim();
            const feedbackBox = document.getElementById("feedback");
            
            if (userVal === currentAnswer) {
                feedbackBox.innerHTML = "<span class='correct'>✅ โคตรเป๊ะ! ไปลุยข้อต่อไปเลย</span>";
                currentQuestionStatus = "correct";
                finalizeCurrentQuestion();
                userInputEl.disabled = true;
            } else {
                currentQuestionStatus = "wrong";
                finalizeCurrentQuestion();
                userInputEl.disabled = true;
                
                // แจ้งเตือนและเฉลยคำตอบที่ถูกต้อง
                if (userVal.toLowerCase() === currentAnswer.toLowerCase()) {
                    feedbackBox.innerHTML = `<span class='incorrect'>❌ ผิดตัวพิมพ์เล็ก-ใหญ่! คำตอบที่ถูกต้องคือ <strong>${currentAnswer}</strong></span>`;
                } else {
                    feedbackBox.innerHTML = `<span class='incorrect'>❌ ผิดจ้า! คำตอบที่ถูกต้องคือ <strong>${currentAnswer}</strong></span>`;
                }
            }
        }

        function handleEnter(e) {
            if(e.key === 'Enter') checkAnswer();
        }

        function restartGame() {
            scoreCorrect = 0;
            scoreIncorrect = 0;
            scoreSkipped = 0;
            currentQuestionStatus = "completed";
            updateScoreUI();
            nextQuestion();
        }

        // เริ่มเกมข้อแรกทันทีที่โหลดเว็บ
        nextQuestion();
