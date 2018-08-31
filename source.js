//só quando a página tá pronta
$(	function(){
		//arrays de json
		var userToken;		//salva o token do usuario
		var userGroups;		//salva os group_id do usuario
		var userForums;		//salva os forum_id do usuario
		var userContent;	//salva os contents de cada forum

		var aux1;			//salva o userGroups[i].groups[j].id;
		var aux2;			//salva o userForums[k].id

		//quando o botão for clicado
		$("#request").click(	function(){
								//guarda os valores de entrada
								var usuario = $("#login").val();
								var senha = $("#password").val();


								//primeiro request, faz o post pra pegar o token de usuario
								$.post(
									"http://solar.virtual.ufc.br/oauth/token",
									{ 
										grant_type: "password",
										login: usuario,
										password: senha
									},
									function(data){
										//salva o token
										userToken = data;
										//exibe o token
										$("#resultado").text(
											"token de acesso: " + userToken.access_token
										);


										//segundo request, faz o get pra pegar os group_id do usuário
										$.get(
											"http://solar.virtual.ufc.br/api/v1/curriculum_units/groups/?access_token=" + userToken.access_token,
											function(data){
												//salva os group_id
												userGroups = data;

												//impressão dos group_id
												for (var i = 0; i < userGroups.length; i++){
													for (var j = 0; j < userGroups[i].groups.length; j++){
														$("#resultado").append(
															", turma " + i + j + ": " + userGroups[i].groups[j].id
														);
													}
												}


												//terceiro request, faz o get pra pegar as id dos foruns
												for (var i = 0; i < userGroups.length; i++){
													for (var j = 0; j < userGroups.length; j++){
														//tem que ser definido aqui, se for mais pra baixo por algum motivo já saiu do escopo
														//salva o numero do grupo atual
														aux1 = userGroups[i].groups[j].id;
														$.get(
															"http://solar.virtual.ufc.br/api/v1/groups/" + userGroups[i].groups[j].id + "/discussions/?access_token=" + userToken.access_token,
															function(data){
																//salva os foruns id
																userForums = data;

																//imprime os forum id
																for (var k = 0; k < userForums.length; k++){
																	$("#resultado").append(
																		", forum: " + userForums[k].id
																	);
																}


																//quarto e ultimo request, faz o get pra pegar todos os contents de foruns
																for (var k = 0; k < userForums.length; k++){
																	//tem que ser definido aqui, se for mais pra baixo por algum motivo já saiu do escopo
																	//salva o numero do forum atual
																	aux2 = userForums[k].id;
																	//mostra visualmente só pra tirar a dúvida
																	//alert(aux1 + ", " + aux2);
																	console.log("group_id: " + aux1 + ", forum_id: " + aux2);
																	$.get(
																		"http://solar.virtual.ufc.br/api/v1/discussions/" + userForums[k].id + "/posts/?group_id=" + aux1 + "&access_token=" + userToken.access_token,
																		function(data){
																			//salva os contents
																			userContent = data;

																			//imprime os contents
																			for (var l = 0; l < userContent.length; l++){
																				$("#resultado").append(
																					", mensagem: " + userContent[l].content
																					//faz o dump de todos os dados 
																					//JSON.stringify(userContent)
																				);
																			}
																		},
																		"json"
																	);
																}


															},
															"json"
														);
													}
												}


												/*//modelo de request get na minha formatação
												$.get(
													"url",
													function(data){
													
													},
													"json"
												);*/


											},
											"json" 
										);


									},
									"json"
								);


							}
		);
	}
);