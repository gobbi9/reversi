function Tabuleiro(id, dimensao, qtdQuadrados){
	this.qtdQuadrados = qtdQuadrados;
	this.dimensao = dimensao;
	this.id = id;
	this.div = document.getElementById(this.id);
	this.raioBorda = this.dimensao / 24;
	this.possiveisUltimaJogada = new Array();
	this.folga = this.qtdQuadrados * 2 + 4;
	this.jogadas = new Array();
	this.jogadorDaVez = null;
	
	with (this.div.style){
		height = width = this.dimensao + this.folga +"px";
	}			

	this.casas = new Array(this.qtdQuadrados);
	
	for (var i = 0; i < this.qtdQuadrados; i++)	
		this.casas[i] = new Array(this.qtdQuadrados);
	
	var casa, iLimite = this.qtdQuadrados - 1;
		
	for (var i = 0; i < this.casas.length; i++)	
		for (var j = 0; j < this.casas[i].length; j++){
			casa = new Casa(Tipo.VAZIO, this.dimensao / this.qtdQuadrados);
			
			casa.div.id = this.id+i+""+j;
			casa.x = i;	
			casa.y = j;		
			
			//casa.div.innerHTML = casa.div.id; /*debug*/
		
			if (i == 0)
				casa.div.style.borderTop = "#BBB solid 2px";
			if (j == 0)
				casa.div.style.borderLeft = "#BBB solid 2px";
			if (i == iLimite)
				casa.div.style.borderBottom = "#BBB solid 2px";
			if (j == iLimite)
				casa.div.style.borderRight = "#BBB solid 2px";
								
			if (i == 0 && j == 0)
				casa.div.style.borderTopLeftRadius = this.raioBorda+"px";
			if (i == 0 && j == iLimite)
				casa.div.style.borderTopRightRadius = this.raioBorda+"px";
			if (i == iLimite && j == 0)
				casa.div.style.borderBottomLeftRadius = this.raioBorda+"px";
			if (i == iLimite && j == iLimite)
				casa.div.style.borderBottomRightRadius = this.raioBorda+"px";
				
			this.casas[i][j] = casa;
									
			this.div.appendChild(casa.div);
			
			//console.log(this.casas[i][j].toHTML());	
		}
			
}

Tabuleiro.prototype.toString = function(){
	var buff = "";
	for (var i = 0; i < this.casas.length; i++)	
		for (var j = 0; j < this.casas[i].length; j++)
			buff += i + ", " + j + ", " + this.casas[i][j].toString() + "\n";
	return buff;
}

// atualizar propriedade do objeto -> atualizar div
Tabuleiro.prototype.refresh = function(){
	with (this.div.style){
		height = width = this.dimensao + this.folga +"px";
	}	

	for (var i = 0; i < this.casas.length; i++)	
		for (var j = 0; j < this.casas[i].length; j++){
			this.casas[i][j].dimensao = this.dimensao / this.qtdQuadrados;	
			this.casas[i][j].refresh();				
		}

}

Tabuleiro.prototype.ehIgual = function (casaA, casaB) {
	return casaA.x == casaB.x && casaA.y == casaB.y;
}

Tabuleiro.prototype.mesmaLinha = function(casaA, casaB){
	if (this.ehIgual(casaA,casaB)) return false;
	if (casaA.x == casaB.x) return true;
	return false;
} 

Tabuleiro.prototype.mesmaColuna = function(casaA, casaB){
	if (this.ehIgual(casaA,casaB)) return false;
	if (casaA.y == casaB.y) return true;
	return false;		
}

Tabuleiro.prototype.mesmaDiagonalSecundaria = function(casaA, casaB){
	if (this.ehIgual(casaA,casaB)) return false;
	if (casaA.x + casaA.y == casaB.x + casaB.y) return true;
	return false;		
}

Tabuleiro.prototype.mesmaDiagonalPrimaria = function(casaA, casaB){
	if (this.ehIgual(casaA,casaB)) return false;
	if (Math.abs(casaA.x - casaB.x) == Math.abs(casaA.y - casaB.y)) return true;
	return false;		
}

Tabuleiro.prototype.existeCaminho = function(casaA, casaB){
	return this.mesmaLinha(casaA, casaB) || this.mesmaColuna(casaA, casaB) ||
		this.mesmaDiagonalPrimaria(casaA, casaB) || this.mesmaDiagonalSecundaria(casaA, casaB);
		
}

Tabuleiro.prototype.caminho = function (casaA, casaB){
	var casasDoCaminho = new Array();
	var i0, j0, i1, j1, di, dj;
	
	if (this.mesmaLinha(casaA, casaB)){
		i0 = i1 = casaA.x;
		j0 = casaA.y;
		j1 = casaB.y;
		
		if (j1 > j0) dj = 1;
		else dj = -1;
		
		j0 += dj;
		
		while (j0 != j1){
			casasDoCaminho.push(this.casas[i0][j0]);
			j0 += dj;
		}
		
	} 
	else if (this.mesmaColuna(casaA, casaB)){
		i0 = casaA.x;
		i1 = casaB.x;
		j0 = j1 = casaA.y;
		
		if (i1 > i0) di = 1;
		else di = -1;
		
		i0 += di;
		
		while (i0 != i1){
			casasDoCaminho.push(this.casas[i0][j0]);
			i0 += di;
		}
	}
	else if (this.mesmaDiagonalPrimaria(casaA, casaB) || this.mesmaDiagonalSecundaria(casaA, casaB)){
		i0 = casaA.x;
		i1 = casaB.x;
		j0 = casaA.y;
		j1 = casaB.y;
		
		if (i1 > i0 && j1 > j0) 
			di = dj = 1;
		else if (i1 < i0 && j1 < j0)
			di = dj = -1;					
		else if (i1 > i0 && j1 < j0) {
			di = 1;
			dj = -1;
		}
		else if (i1 < i0 && j1 > j0) {
			di = -1;
			dj = 1;
		}
		
		i0 += di;
		j0 += dj;
		
		while (true){
			if (i0 == i1 && j0 == j1) break;
			casasDoCaminho.push(this.casas[i0][j0]);
			i0 += di;
			j0 += dj;					
		}			
	}
	
	return casasDoCaminho;
}

Tabuleiro.prototype.caminhoHomogeneo = function (caminho, jogador){
	var resposta = true;
	
	if (caminho.length == 0) return false;
			
	for (var i = 0; i < caminho.length; i++){
		if (caminho[i].tipo != jogador)
			return false;	
	}
	
	return resposta;
}

Tabuleiro.prototype.selecionaCasasDoTipo = function (tipo){
	var casas = new Array();
	for (var i = 0; i < this.casas.length; i++)	
		for (var j = 0; j < this.casas[i].length; j++)
			if (this.casas[i][j].tipo == tipo)
				casas.push(this.casas[i][j]);
	return casas;
}

// retorna a lista de casas possiveis para um jogador
Tabuleiro.prototype.jogadasPossiveis = function(jogador){
	// se existe caminho soh de brancos entre casas jogador A e vizinhos vazios jogador B
	
	var possiveis = new HashSet();
	if (jogador == Tipo.JOGADOR1) oponente = Tipo.JOGADOR2;
	else oponente = Tipo.JOGADOR1;
		
	var casasJogadorDaVez = this.selecionaCasasDoTipo(jogador);			
	
	var vizinhosOponente = this.vizinhosVazios(oponente);
	var caminho;
	
	for (var i = 0; i < casasJogadorDaVez.length; i++)
		for (var j = 0; j < vizinhosOponente.length; j++){
			caminho = this.caminho(casasJogadorDaVez[i], vizinhosOponente[j]);
			if (caminho.length > 0 && this.caminhoHomogeneo(caminho, oponente)) 
				possiveis.add(vizinhosOponente[j]);
		}
	
	return possiveis.values();
}

// se jogador = 1, retorna todos os vizinhos das casas preechidas pelo
// jogador 1 que estão vazios
Tabuleiro.prototype.vizinhosVazios = function (jogador){
	var vizinhos = new HashSet();
	for (var i = 0; i < this.casas.length; i++)	
		for (var j = 0; j < this.casas[i].length; j++){
			if (this.casas[i][j].tipo == jogador){
				if (this.posicaoValida(i-1, j-1)) vizinhos.add(this.casas[i-1][j-1]);
				if (this.posicaoValida(i-1, j)) vizinhos.add(this.casas[i-1][j]);
				if (this.posicaoValida(i+1, j+1)) vizinhos.add(this.casas[i+1][j+1]);
				if (this.posicaoValida(i+1, j)) vizinhos.add(this.casas[i+1][j]);
				if (this.posicaoValida(i, j-1)) vizinhos.add(this.casas[i][j-1]);
				if (this.posicaoValida(i-1, j+1)) vizinhos.add(this.casas[i-1][j+1]);
				if (this.posicaoValida(i+1, j-1)) vizinhos.add(this.casas[i+1][j-1]);
				if (this.posicaoValida(i, j+1)) vizinhos.add(this.casas[i][j+1]);
			}
		}
	return vizinhos.values();
}

Tabuleiro.prototype.posicaoValida = function (i, j){
	var lim = this.qtdQuadrados - 1;
	if ( (i >= 0 && i <= lim) && (j >= 0 && j <= lim) && this.casas[i][j].ehVazio())
		return true;
	return false;
}

// assumindo casaA posição possivel
Tabuleiro.prototype.todosCaminhos = function (casaA, jogador){
	if (jogador == Tipo.JOGADOR1) oponente = Tipo.JOGADOR2;
	else oponente = Tipo.JOGADOR1;
	
	var caminhos = new Array();
	var casasDoTipo = this.selecionaCasasDoTipo(jogador);
	for (var i = 0; i < casasDoTipo.length; i++){
		var caminho = this.caminho(casaA, casasDoTipo[i])
		if (caminho.length > 0 && this.caminhoHomogeneo(caminho, oponente))
			caminhos.push(caminho);
	}
	
	return caminhos;
		
}

Tabuleiro.prototype.mostrarPossiveis = function (){
	var vez = this.jogadorDaVez.id;
	for (var i = 0; i < this.possiveisUltimaJogada.length; i++) {
		$(this.possiveisUltimaJogada[i].div).removeClass("possivel");
		$(this.possiveisUltimaJogada[i].div).addClass("casa");				
	}

	this.possiveisUltimaJogada = this.jogadasPossiveis(vez);
	for (var i = 0; i < this.possiveisUltimaJogada.length; i++) {
		$(this.possiveisUltimaJogada[i].div).removeClass("casa");
		$(this.possiveisUltimaJogada[i].div).addClass("possivel");				
	}
}

Tabuleiro.prototype.jogadaValida = function (casa) {
	return this.possiveisUltimaJogada.indexOf(casa) >= 0;
}

Tabuleiro.prototype.fimDoJogo = function (){
	return this.jogadasPossiveis(Tipo.JOGADOR1).length == 0 && 
			this.jogadasPossiveis(Tipo.JOGADOR2).length == 0;
}

Tabuleiro.prototype.obterTriplas = function (){
	triplas = new Array();
	for (var i = 0; i < this.casas.length; i++)	
		for (var j = 0; j < this.casas[i].length; j++)
			triplas.push(new Array(this.casas[i][j].x, this.casas[i][j].y, this.casas[i][j].tipo));
	return triplas;
}

Tabuleiro.prototype.restaurarTriplas = function(triplas){
	var x,y,tipo;
	for (var i = 0; i < triplas.length; i++){
		x = triplas[i][0];
		y = triplas[i][1];
		tipo = triplas[i][2];
		this.casas[x][y].x = x;				
		this.casas[x][y].y = y;
		this.casas[x][y].tipo = tipo;
	}
	this.mostrarPossiveis();
	this.refresh();		
}

Tabuleiro.prototype.jogar = function (casa) {
	this.jogadas.push(new Jogada(casa, this.obterTriplas(), this.jogadorDaVez.clonar()));

	this.simularJogada(casa);
	
	this.refresh();
				
	// contar blocos
	var contador1 = 0, contador2 = 0;	
	for (var i = 0; i < this.casas.length; i++)	
		for (var j = 0; j < this.casas[i].length; j++){
			if (this.casas[i][j].tipo == Tipo.JOGADOR1)
				contador1 ++;
			else if (this.casas[i][j].tipo == Tipo.JOGADOR2)
				contador2 ++;
			}
	if (this.jogadorDaVez.id == Tipo.JOGADOR1) {
		this.jogadorDaVez.pontos = contador1;
		this.jogadorDaVez.oponente.pontos = contador2;
	} 
	else {
		this.jogadorDaVez.pontos = contador2;
		this.jogadorDaVez.oponente.pontos = contador1;
	}

	//contar jogadas	
	this.jogadorDaVez.jogadas++;
	
	
	this.jogadorDaVez = this.jogadorDaVez.passarVez();
	
	this.mostrarPossiveis();
	
	
	while (this.jogadasPossiveis(this.jogadorDaVez.id).length == 0){
		if (this.fimDoJogo()) {
			alert("Fim do Jogo");
			break;
		}
		console.log("O jogador passou a vez, pois nao havia mais jogadas");
		this.jogadorDaVez = this.jogadorDaVez.passarVez();
		this.mostrarPossiveis();
	}
}

Tabuleiro.prototype.simularJogada = function (casa) {
	casa.tipo = this.jogadorDaVez.id;		
	
	var caminhos = this.todosCaminhos(casa, this.jogadorDaVez.id);
	
	for (var i = 0; i < caminhos.length; i++)
		for (var j = 0; j < caminhos[i].length; j++){
			x = caminhos[i][j].x;
			y = caminhos[i][j].y;
			this.casas[x][y].tipo = this.jogadorDaVez.id;
		}
}

Tabuleiro.prototype.desfazerJogada = function(){
	if (this.jogadas.length == 0){
		window.alert("Não há mais jogadas a serem desfeitas");
	}
	else{
		var ultimaJogada = this.jogadas.pop();
		this.restaurarTriplas(ultimaJogada.triplas, ultimaJogada.jogador);
		this.jogadorDaVez = ultimaJogada.jogador.oponente.passarVez();
	}
	//console.log(tabuleiro);
	//console.log(jogador);
}
