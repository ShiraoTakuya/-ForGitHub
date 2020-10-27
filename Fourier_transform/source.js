'use strict';

function transpose(a){
  return a[0].map(function (_, c) { return a.map(function (r) { return r[c]; }); });
}

function toCSV(ar){
	var st = "";
	for(var i = 0; i < ar.length; i++){
		var artmp = [];
		for(var j = 0; j < ar[i].length; j++){
			artmp.push(ar[i][j].toExponential(2));
		}
		st += artmp.join(",") + "\r\n";
	}
	return st;
}

function dft(a){
	var Re = [];// [出力] 実数部
	var Im = [];// [出力] 虚数部
	// dft
	var N = a.length;
	for( var j=0; j<N; ++j ){
		var Re_sum = 0.0;
		var Im_sum = 0.0;
		for( var i=0; i<N; ++i ){
			var tht = 2*Math.PI/N * j * i;
			Re_sum += a[i] *Math.cos( tht );
			Im_sum += a[i] *Math.sin( tht );
		}
		Re.push( Re_sum );
		Im.push( Im_sum );
	}

	var amplitude = [];
	for(var i = 0; i < N; i++){
		amplitude.push(Math.sqrt(Math.pow(Re[i], 2) + Math.pow(Im[i], 2)));
	}
	return transpose([Re, Im, amplitude]);
}

function writefile(st, filename){
	//URL生成
	var blob = new Blob([st], {type: "text/plain"});
	var a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.target = '_blank';
	a.download = filename;
	a.click();
}

function onDrop(event){
	event.preventDefault();

	var f = event.dataTransfer.files;
	for(var i = 0; i < f.length; i++){
		var reader = new FileReader();
		var disp = document.getElementById("disp");
		var drop = document.getElementById("drop");
		drop.classList.toggle('process');
		disp.textContent ="データ処理中";

		reader.onload = function (e) {
			//データ読み込み
			var data_row = e.target.result.split("\n").map(Number);

			//フーリエ変換
			var data_fft = dft(data_row);

			//ファイル出力
			writefile(toCSV(data_fft), "(FFT)" + e.target.fileName);

			//結果表示
			drop.classList.toggle('process');
			disp.textContent ="完了しました";
		}

		reader.fileName = f[i].name;
		reader.readAsText(f[i]);
	}
}

function onDragOver(event){ 
	event.preventDefault(); 
}

var hash = {};
var arDiv = ['drop', 'disp'];
arDiv.forEach((st) => {
	hash[st] = document.createElement('div');
	hash[st].id = st;
	hash[st].classList.add(st);
	document.body.appendChild(hash[st]);
})

hash['drop'].textContent = "ここにファイルをドロップ";
hash['drop'].addEventListener('dragover', onDragOver, false);
hash['drop'].addEventListener('drop', onDrop, false);

hash['drop'].addEventListener('click', function(){
		hash['drop'].classList.toggle('warning');
		hash['drop'].textContent = "ファイルをドロップしてください";
	}, false);

hash['disp'].textContent = "ドロップ待機中";

