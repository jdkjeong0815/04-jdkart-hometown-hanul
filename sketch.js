// =============================================================================
// 프로그램 : 04-jdkart-hometown-hanul
// Created : 2024-Dec-23
// 작가 : jdk                    Inspiration : By Steve's Makerspace (오리지널) https://youtu.be/R0OFyWEglGA
// Github : https://github.com/jdkjeong0815/04-jdkart-hometown-hanul
// Web : https://jdkjeong0815.github.io/04-jdkart-hometown-hanul/
// 작품 설명 : 
// 라이브러리 기능 : jdklib.js
// 주기적인 리로드 : 매  ??초
// Last Update : 
// 2025-Jan-14 요약
//  - 1) 작가명칭 삭제 => 프로젝트 명칭으로 대체
//  - 2) 
// 2024-Jan-10 요약
//  - 1) 나무 크기 조정, 화면을 윈도우 크기에 맞게 자동으로 조정
//  - 2)  
// =============================================================================

let saveFileName = "04-jdkart-hometown-hanul";
let logMessages = []; // 로그 메시지를 저장하는 배열
let maxLogs = 10; // 화면에 표시할 최대 로그 개수
let treeImages = []; // Array to store tree images
let numTrees = 39; // Number of tree images to preload
let myFont;

function preload() {
  // 폰트 설정
  myFont = loadFont('assets/font/GreatVibes-Regular.ttf'); // 원하는 고딕체 파일 경로
  
  // Load tree images with callback to skip non-existent files
  for (let i = 0; i < numTrees; i++) {
    let imgPath = `assets/tree/dead-tree-silhouette-${i}.png`;
    loadImage(imgPath, 
      img => treeImages.push(img), // Success callback
      err => console.log(`Image not found: ${imgPath}`) // Error callback
    );
  }
}

function touchStarted() {
  // 첫 번째 터치: 풀스크린 활성화
  let fs = fullscreen();
  fullscreen(!fs);
  
  setTimeout(newArt, 2000);  // 애니메이션 효과를 위해 2초로 변경
  // return false; // 기본 터치 동작 방지
}

function setup() {
  noScroll(); // 스크롤 금지. 스크롤바 생기는 것 방지
  // 고딕체 폰트적용
  textFont(myFont); 
  
  // console.log를 오버라이드하여 메시지를 캔버스에 표시하도록 설정
  overrideConsoleLog();
  
  // 주기적으로 갱신
  newArt();
  setInterval(newArt, 6000); // generate new art every 60 seconds
}

function newArt() {
  // 텍스트 버퍼 리셋
  logMessages = [];

  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 120, 100, 255);
  background(0);
  background(220,80,50);
  // 1) 달 그리기
  noStroke();
  fill(random(255),random(50, 80), random(50, 80));
  let posMoon;
  posMoon = random(1) < 0.7 ? 3 : 1.5; // 3을 70%, 1.5를 30% 확률로 선택
  circle(width/posMoon, height/3, width*0.5);
  
  // 2) 배경 질감 만들기
  strokeWeight(0.6);
  
  let rez1, rez2;
  let rez1Options = [0.006, 0.06, 0.6, 0.0006]; // rez1 옵션들
  let rez2Options = [0.005, 0.05, 0.5, 0.0005]; // rez2 옵션들
  // 옵션 중 랜덤 선택
  rez1 = random(rez1Options);
  rez2 = random(rez2Options);
  //console.log("Angle: ", rez1, "     Color: ", rez2);
  //rez1 = 0.0006; // angle 0.006 / 0.06 / 0.6 /0.0006
  //rez2 = 0.0005; // color 0.005 / 0.05 / 0.5 /0.0005
  gap = 15;
  len = 10;
  startVary = 25;
  startCol = random(360);
  strokeCap(SQUARE);
  // noprotect
  for (i = -20; i < width + 20; i += gap) {
    for (j = -20; j < height + 20; j += gap) {
      n2 = (noise (i * rez2, j* rez2) - 0.2) * 1.7;
      h = floor(n2 * 5) * 72 + startCol;
      if (h>360){
        h -= 360
      }
      stroke(h + random(-8,8), 80 + random(-15, 15), 80 + random(-15,15), 200);
      x = i + random(-startVary,startVary);
      y = j + random(-startVary,startVary);
      for (k = 10; k > 0; k--) {
        strokeWeight(k * 0.3);
        //strokeWeight(random(6));
        n1 = (noise(x * rez1, y * rez1) - 0.2) * 1.7;
        ang = n1 * PI * 2;
        newX = cos(ang) * len + x;
        newY = sin(ang) * len + y;
        line(x, y, newX, newY);
        x = newX;
        y = newY;
      }
    }
  }
  
  // 3) 페이퍼 텍스쳐 입히기
  paperTexture(1);
  paperTexture(0);  
  
  // 4) 나무 그리기
  // 4-1) 나무 이미지 랜덤 선택
  let selectedTree = random(treeImages);
  // 선택된 이미지의 순번 출력
  // let index = treeImages.indexOf(selectedTree);
  // console.log(index);
 
  let treeScale = random(0.66, 0.76);  // 0.666 화면 대비 나무는 2/3 높이 기준
  let ratioTree = selectedTree.width / selectedTree.height;
  let imgHeight = height * treeScale;
  let imgWidth = imgHeight * ratioTree;

  // 4-3) 나무 위치 설정
  let posX = random(0, width - imgWidth)  // 임의의 위치
  let posY = height - imgHeight + 35; // 나무의 높이를 아래로 35px 내림. 밑면이 바닥에 닿도록.
   
  // 4-4) 나무 그리기
  image(selectedTree, posX, posY, imgWidth, imgHeight);

  // 5) 필터 효과 주기
  //console.log("Tree Scale: ", treeScale);
  if(treeScale < 0.2) {
    filter(INVERT);   // 색상 뒤집기
    //console.log("Invert");
  }
  if(treeScale > 0.8) {
    filter(GRAY);
    //console.log("Gray");
  }
  
  // 로그 메시지 표시
  let lineHeight = 20; // 줄 간격을 일정하게 유지
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  fill(0);
  for (let i = 0; i < logMessages.length; i++) {
    text(logMessages[i], width - 10, height - 10 - i * lineHeight); // 하단 우측에 표시
  }
  
  // 현재 타임스탬프 생성
  const timestamp = getTimestamp(); 
  text(timestamp, width - 10, height - 10 - logMessages.length * lineHeight);
  // jdk 싸인
  //text("By DK Jeong", width - 10, height - 10 - (logMessages.length + 1) * lineHeight);
  // 프로젝트명
  text("Hometown Hanul", width - 10, height - 10 - (logMessages.length + 1) * lineHeight);
  // 텍스트 버퍼 리셋
  logMessages = [];
}

function paperTexture(textureType) {
  //based on color present
  noFill();
  colVary2 = 15; //40
  let textureNum, alph2;
  //textureType = 1;//random(2);
  if (textureType < 1.0) {
    //blurring
    textureNum = 10000;
    strokeWeight(width * 0.02); 
    alph2 = 15;//random(10, 20); 
  } else if (textureType < 2) {
    //regular paper texture
    textureNum = 15000;
    strokeWeight(max(1, width * 0.0011)); //1.5
    alph2 = 210;//random(100, 220);
  }
  colorMode(RGB);
  for (i = 0; i < textureNum; i++) {
    x = random(width);
    y = random(height);
    col = get(x, y);
    stroke(
      col[0] + random(-colVary2, colVary2),
      col[1] + random(-colVary2, colVary2),
      col[2] + random(-colVary2, colVary2),
      alph2
    ); 
    push();
    translate(x, y);
    rotate(random(PI * 2));
    curve(
      height * random(0.035, 0.14),
      0,
      0,
      height * random(-0.03, 0.03),
      height * random(-0.03, 0.03),
      height * random(0.035, 0.07),
      height * random(0.035, 0.07),
      height * random(0.035, 0.14)
    );
    pop();
  }
  colorMode(HSB, 360, 120, 100, 255);
}

function overrideConsoleLog() {
  const originalLog = console.log; // 기존 console.log 저장

  console.log = function (...args) {
    const message = args.join(" "); // 여러 인수를 하나의 문자열로 결합
    logMessages.unshift(message); // 배열에 메시지 추가
    if (logMessages.length > maxLogs) {
      logMessages.pop(); // 오래된 메시지 제거
    }
    originalLog.apply(console, args); // 기존 console.log 실행
  };
}

// 현재 타임스탬프를 yyyy-mm-dd hh:mm:ss 형식으로 반환
function getTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
