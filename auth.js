(function () {
  'use strict';
  const ACCESS_KEY = 'simec_portal_matricula_v1';
  const NAME_KEY = 'simec_portal_nome_v1';
  const ID_KEY = 'simec_portal_usuario_v1';
  const USERS = new Map([["00f6112fe58387958ef80793a34746429f40c97fe7b51d6a576705acbf8fc6af","Diego Luiz Batista de Paiva"],["06ceef9715535b739e13f0eff2d08f2a4d57b537aaa549facff529eaa2af02d0","LUIS PAULO DE OLIVEIRA"],["0dfcebf485c29dd65394538204a5c43821de1e5517712413f44962c1422b3489","RODOLFO OLIVEIRA PACHECO"],["0ee372d0a0fefa4431a2ece96d93c06f3984e8cb8d2d1c4003549e975413bf3e","MARCO AURELIO DE OLIVEIRA MORA"],["0f427d4e1430f8f57221d70dca9854b6bd67c42fda811e0f27939a58a46f25ae","MELQUISEDEQUE BARBOSA DA SILVA"],["158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab","WAGNER LUIS DOS SANTOS"],["1744784df13e160509c06d101c96cb212fe482375338f537e65c2d41b5d8d548","DOUGLAS FELIPE ALVES FREITAS"],["188db7f5c98d585b6b31f7423462c613aa01f3e7149960f7d192480e09000619","Guilherme Henrique Querino"],["18ecbac91f2c707b4c197b403ca381cf3f703d7171314f227210fc56e0970771","PAULO APARECIDO PASSOS"],["1a95046e1c6e0db1f4cc7660af403cecbfa3822bd9abb49a433565d1fe40b7cb","CASSIO HENRIQUE SILVA NASCIMENTO"],["1aaf97e300d50bacc554c8c27a1b9687dde34e6754b8de3759dd0ab844477e37","LUCAS WELLINGTON F DE JESUS"],["1bee34b6262a7777362f96e3dd5635764e820f97bab9772f492397774a38d74a","JOSIMAR SANTOS COSTA"],["1d16bb3354a11b509e641db094ca078be290298b0ec32c6b46b88fe919a1a8ed","EMILIANO PEREZ PATROCÍNIO"],["1da51b8d8ff98f6a48f80ae79fe3ca6c26e1abb7b7d125259255d6d2b875ea08","MARCOS JUDS"],["204a58c3197e64dddee2cc8a2a7da48736a1a413c1ab6e3c111fc1966e4a9cc3","JOASSE FREITAS DA SILVA"],["21113a3f71a6ecda7311c6e8539d1c9bd9949d3e6f23fbf4bcc781f96b30083a","JOSE MARCELO MOREIRA AZEVEDO"],["22f2c8e194c42ba73d51ad92a2b9a45fa29d012298b17e816190347af802e38f","SILAS AUGUSTO DE OLIVEIRA COST"],["255ac64f2a9b374157860601793d61491c561c29df77cbf82d4610772937ce59","DONIZETTI JOSE MOREIRA"],["2920b9489aa3f6afda2de41a7154c767e3dd4f564a184739efc93af235a83bc2","TONI DONIZETTI DOS SANTOS"],["2bbb0ed9e593487865218631abc18ea0cdd660ca87da8c55382a5cc05f72c1eb","TIAGO SERGIO SOUSA MELO"],["2c6499976963e9832529bc8d9dff516d16c13d372d852d1500f5892e46a25507","MARCOS RAFAEL EMILIO"],["2ced184d8477465987593807f31360e94b539aa41f515e0a973179f881663698","ISAAC MENDES DE PALMA"],["2d2c33c52e3df492704c04881c254aa93f37fc0b89dfbafaa9687340e0696ea9","MARCELO MATIAS DA SILVA"],["2e1943902be93c87e9d31812ef887d1f91326e8e8e3779feb59c48c9ac32f58f","LUCAS DE ASSIS CAETANO BONIFACIO"],["2f1223e9508a4ab284d9aca6d6fc249f89999346fcf1d72fcfb3c15e3e9160ca","FRANCISCO CARDOSO PIMENTEL JUNIOR"],["311ba2ed6a5b4105fbfdb0a8b745d22fe1b3ecc0efff5c6b9f7ce12351533558","Lucas Alessandro Mariano Berna"],["325969e80bedf5b28c02098238cea837b30ce46e77255960fdb2e1e2215fbfe0","Zeniltom Muniz Fiais"],["33743b03c28fc783b01119d8b8c6b2564108318d465a2fb4ff319010c4aa6493","LUCAS MOREIRA SILVA"],["355d8c0ee4e5698eaed38b96aab64dbf0ad72eca3e352183be6e957e9d9230a7","JOSE FELIPE DOS SANTOS"],["35a99a53ff1b46f86a14a375742dfd7fefff96a8a2e9c4bcf0fe3546c36c9520","JORGE LUIS PEREIRA"],["3849ba084da2faea804918e8d999dee3f176659e0216debcccbf86b3e6b769ef","GUSTAVO DA SILVA FERREIRA"],["396b8e65a84afe48d62b470e74299638c2d9144bafba47b6027bf1b388010dbd","LUCAS HENRIQUE MELO PEREIRA"],["3a6e2b22591ed55131de9ee07ffdfd443d86554bfc60c2d23e6620d4e2c794df","Irineu Santana Salvador"],["3ab57220f1f10003766dcc4180152b17dfdd7cc9f4e5ccdecf5b48df25ae861c","MARCELO DA ROSA CARDOSO"],["3b7dc65fd47fd991000d80844da28c8699590a1cb30988782bcade39f67794c1","JOAO CARLOS VIEIRA"],["3bbcf69de876e98ac944c5276eaeb44308c00a4e89260ad0067c7c9aeb4532b8","TÉRCIO VIANA DE MELO"],["3bcc1340d90b3d55accb9a57998b69708fea2a63c39f7369047469f952ccad4f","FABIO NILSON DA SILVA MACHADO"],["3c98b2624d1e35016ae337691a8bdce3a639429a9cb34c3e7e04842ab8904b64","RUAN CARLOS ROMERO SILVESTRE"],["41966e55400c17d811391ad507c6af707e42e5528f54cb9734571def64c0e97c","JORGE LUIS DOS SANTOS"],["4332cd76590d0efdbd8d067acf531546da2ba0a67c538440e7defedbea48d1dc","RODOLFO LUIZ DE LIMA"],["43e8852bef636588d357c96ae642844aa7425d8fb73445cc4f017dbd6f5ab6e3","TIAGO SOARES GUIMARÃES NUNES"],["4432cb276ffc79e796e2f86c4aabb5a223462ff45d089d30e5c78c38318c55cf","MARCOS ANTÔNIO DOS SANTOS"],["4459b2909cef1e99ddfb4be233208753a4ed2f43343df6d5b4561c5e9ead51c9","Donowan Kaoan Silva De Oliveir"],["48fe0661615dd0a2fc9cf1b77111613b4c3e7fc857b7bf89e472c233a0b35eb0","THIAGO ALEXANDRE ESTEVES MORAES"],["4aa7c75f447a322ef6880842b631cdc226eeb598cac8f5c813dc06f7d6a58493","ORLANDO BORGES NETO"],["4ab34cdf3e765ab1629ed66b4d683a8d5bd014b8b7e8f2f3edd4cfab45101031","Carlos Renato De Jesus"],["4e7a0668e1de434a88c26ae248ab80e71f3dc5ec603421f2decad10f556f9147","Everton Alves Cabral De Lara"],["4eec6372c08f87b2f48f9c96ea4cb155b0cbd3f883a494067b72c3d1df4e586e","EDUARDO RODRIGUES DOS SANTOS"],["4f5131ea0c5a3e7f4c5f86029ae1be2a60e67f023073bbb074a3a929089e5bc1","MARCOS GUSTAVO SANTOS DE OLIVEIRA"],["4f6ceab7942f9dece7e2e0e93b2c16560d49670d2187082af547c3c3dd339460","DIEGO BRASIL DOS SANTOS"],["4fc779c823fd37ed61f66a6ae37c9dffed06bb295f3902d2fa9d485aa741a724","GABRIEL DALMAGRE DA CRUZ"],["50828327cbf487d99d22c77ef8f980e5d7c8b93e2a1d1b084e2dc6760240e738","ALEXANDRE DOS SANTOS MACIEL"],["51054b8a03281fd02034378a5570ae0c970fb1d5d64246e0eb981481c228c108","LUCAS FERNANDO DE MOURA"],["51f8abfe29ee9821b5727c55d31f9d29115fe91b610751d7c9586b91178c0119","CADASTRO A CONFERIR · MATRÍCULA 1871"],["52a6932d5af5316a815af86286167054ebaa4953cedb82e3914a5c126e363ea4","MARCO ANTONIO DE CARVALHO COSTA"],["52ed8fba503e8a9d8e235041ef867cd3cdcd7426125a5e322859c1c3e826c876","RODOLPHO SOUZA GOMES"],["5325302e6a26d6e63f0988d276af9e618e78b9997c4893665618fce15af0fff3","JOSE MARCELO MOREIRA AZEVEDO"],["53f15ca2c3a39541db966c5d52047590467b0d275a39b54dcb213b544a530c2c","EVANDRO LUIS PEREIRA"],["5627b4a8f9efbd8fbdadaf4177824186f8c734f320935c88e926bc027af6c50f","Valcir Jose Da Silva"],["589f5ed0ac1c85dfee591cc158b373813c114efdf343af279bba99ff8569288b","JOÃO VITOR DOS SANTOS MIMOSO"],["59933d776452c8a5a00db247871079d8ae1e273192afd2075cb917cb5bbe402f","RODRIGO MOREIRA PAIVA"],["5bc05e241527d767aae5d0921978e11918f632b8cefc1de520745e9b9ffd09c4","RODOLFO GUILHERME DA SILVA SILVESTRE"],["5c0b1ae7ef3b0e1552cd215596a4449a8bcd5d060f18511da8e63b87f67c11f6","GUTEMBERG MODESTO SILVA"],["5cd5e6e836cd713686bd2ccc7a5626db84a4c23f91d00d02eaed726d9f5b7220","GUSTAVO CARLOS DA SILVA"],["62fb418140a7ee4153da89e8b0f7c453e27db7e034d15502422c21f476cf4fbd","WAGNER LUIS DE OLIVEIRA"],["639c1115ab55d139a527f7bb3c1a9570bb60cf96f5c13bdaa41a7264a74e748f","BRUNO HENRIQUE DOS SANTOS SILVA"],["63a4b69673ba773821ec0128843e7c2a0c7089c4f85f2b05d088cae62bf64647","VITOR VINICIUS DUTRA"],["6641020d80e10877a13a973592d934165de39c743f7a2fa3f78a8671ac2e9c5b","CLAYVERSON SANTOS DA SILVA"],["66a7a5807c3130eb2d0b55bb260a6a001b9d62095c94b753cbb215f3e4f099e1","MAICON CESAR SOUZA REIS"],["672eb365c903a3b4558bebaef687a5fe9599d87f8b816558d88cc53f5ae9e577","ANDERSON GOMES DA SILVA"],["6793f9e266ce6ebd9638631553a952f0f83f9efdc955dd6789aae0bd332fbef2","JOSÉ RICARDO DE OLIVEIRA"],["679b0ecadd205e5143506d637aaec6849987ae11c8c8280fb79f4d1080326eec","JAISON BRUNO DA SILVA"],["67b75961400e53222b0107d3e6c3b223d6de41c6875c202704ca580a7fece038","RAFAEL WILIAN FERREIRA MASSAGA"],["6a7a1382f96c6e92e5ae50aedcbf77cc1e51c0750c363cb9bbcd4d558421b2c4","LUCAS ANDRADE DA LUZ"],["6cf713e83ca48f8a190b07af39303ea10884872d491f8d0c2056907fc2a26bad","MATHEUS VIEIRA MUNIZ"],["70e8d52a9b4616e728112408ceca7abd9507e93f30e958ecb09f6ea607d99d06","JULIO CESAR DA SILVA ROCHA"],["728edd27debc2046984906dbbb117313dab4a9f0e9b47c7f0411e236c175f3e2","LUCAS SENDON DE MELO"],["731d65cdd441fde25333a70782a078911af63ef672e299a906030e16ff66756b","MARCIO DUARTE DA ROSA"],["73a2af8864fc500fa49048bf3003776c19938f360e56bd03663866fb3087884a","FELIPE AUGUSTO SILVA PESSOA"],["740c59b88403e9ba91877e0e1b09442adb8b90628d39a0ba4f85109fa42c0355","ANDRÉ DOS SANTOS RODRIGUES"],["77334823791bea53e508ba59387c1287c8da962026769657b4686756db4b7bc8","RYAN GABRIEL CAMPOS DE MOURA"],["777abbc10ddf9551bf53465886aa3735ae687df3c3bacf08fa300736422cc21b","JONATH OLIVEIRA DA SILVA"],["7907a88d77f29a7681a0dc6c89157ea3f45959944436301085c8a34a46fe4a77","ANGELO RAFAEL BOZA"],["7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f","CAMILLY CEZARIO DE SOUZA E SILVA"],["79b50932dd998d253b85c9f6c57c6b64dac3e58c252c38720af0ee7a249860eb","RENAN APARECIDO DOS SANTOS"],["7e62ce15499878ca883e552b485ccc2f5dc86c7664c4446cc7f99a247f3f0ae1","DIEGO PACHECO"],["80f8ded29fa2e922c77b98ea8f229ef65ea360daf5d1c9e05b80539e502b5621","FRANCOIS STEFAN MEDEIROS DE SOUSA"],["81b187544ef8734d6c3668ffd47b2e7761a7c374074eb4091e95a5385a318c9d","RODRIGO MARTINIANO PEREIRA"],["86748254b6bfcc91d1a9b18d2b99dc9fdebec608dd68b83c3186a94f36e5f4c3","Paulo Roberto Marchezine Braga"],["88100ba34db736c9adec9ed7e8e3b56b6379e51f6009841c37a71bfabf8deabf","MARCELO DO PRADO"],["899fe985e893b124dff8820c977e7dd623078c36161ae3cfe6f75c0c819a8157","MARCIO JOSÉ COELHO DE OLIVEIRA"],["8c9089be2f18fb286889edf8531a43aff6fa8b6f28b531f8167d87d66b8f5b1d","FABRÍCIO DOS REIS DA CRUZ FRANCISCO"],["8e1f192fe25ad49be764c3f55c68beb32f7aa66f85344e026b76cfaaa1d3d88a","ANDRÉ ALEXANDRE LOPES"],["8e4e975f902448d84ed0ccf871f6439958625810e15b748dbe355c5b08ac073d","ERICK PATRICK LEITE DOS SANTOS"],["8e614d39a1f1279958da1c9f7e8df51db4aabca8cc3a3e84f8c3dc5f88e1fcfb","WANDERSON LOPES GOMES"],["8ea8eb612f9362da9d2b8ae0a65daa6410c9c952a4944933a8ad17aee8f86939","LUIS FELIPE RIBEIRO LOPES"],["8efb3a60255de6db1c77dcdaec905d1045a88e70dddd53d524fc4cb7d1a609d7","GUTHIERRE FERREIRA OLIVEIRA"],["8f0f97e140e126a4404a09eb1e14a53b7c742701c4290a5d1702d14daec22ee8","MARCUS VINÍCIUS SIQUEIRA DE SOUZA"],["8f96a045c9a91a2d1923f02af68fd20895fab2d8f908385377297cf5bc2f30ff","DAVI DA SILVA CRUZ"],["8ffe8459134b46975acd31df13a50c51dbeacf1c19a764bf1602ba7c73ffc8fb","JEANDERSON RODRIGO DOS SANTOS"],["920a6421f4b7573cfb0d0fb8d61252665275d0b97bc18683638dee3e8a015f01","ANDRÉ FIGUEIREDO CANDIDO"],["9212e5e6ef4106525be27ac4fcde2db1aa65f4e706eb469cea7f0baec27dcc96","DANIEL SANTOS PRIMO"],["92abb80a9a9b828aeeef27efa528a247f91824f8d65773c1ac28781f931a6f40","WELLINGTON D'AVILLAS DOS SANTOS"],["930f7bc78c2340e72256603f3c3803be6664b9b05bd91a996fcec771c6917dab","RODRIGO CARLOS DOS SANTOS"],["934aa7be7deafc0053e92ce49a029603af8bc0b3891322a10b7ab730dfaa5d63","JIME RAMOS DA SILVA"],["952795a1f797b5c993ffc5d074b143eae036a499995e63f3dbd56ebba4e4ed9d","MELQUE FERREIRA BARBOZA"],["97b3e84b5db5f23c51da10dba4f967a0723da721fc136aa00ca43da3ad5e3a6d","CLEITON LUIS FRANCA COUTINHO"],["983589f68a61012b2fda3650f4de287b194ba5bfa64a0028dc97a12bdadfee03","WILLIAM DOS SANTOS GONÇALVES"],["995e6d18fd6dd12d54ea1291649769dde86b36ee70193e3142fdc07aaa765d00","Thiago Audieri Da Silva"],["99cf15ac55d54e0c14d9bd363e3037ab63daebbc68b836ea162fcd22f86c4545","GILMAR LANDIM"],["9b5173ba93decd311f89513f060a62d652ec189f0dba97db15c2a07787add029","FLAVIO FELICIO DA SILVA JUNIOR"],["9bbf7a2c2940b4c95ea485f65a8731a1372aee56edca6ed31e66e7eb0f47e28b","CAIO AUGUSTO DA SILVA BARBOSA"],["9e3b6232cb7bd60ef9c5088e1c6dac834ddc05d916e88e2aacf84bb18c8d707a","DENIS APARECIDO DE OLIVEIRA"],["9e645831962e43f534afd60532328ba5ab4eefea6e73765fb9690e4d395112f8","KAUA BETTIN ANANIAS"],["a0119e19d7f710c158729bc4153a6996e891b54664262b502c7be665e0f2f042","LUCAS TALARICO DA SILVA"],["a56b54e1c5933a83f79b301d0c08410a5617b868120da82b7e088c42a5a8025c","ULISSES FONTES CUNHA"],["a64332fe1df1790cb79d428bf5b5767ddd589b1cca825cb1b9eb30f7e9aaee03","ALEXANDER GARCEZ SIQUEIRA"],["a78000a5ff6306012360b87357e93eb04bd07897b57167459c36c70215ddbc70","LUCIANO DA SILVA VIDAL"],["a860d24f31d82a4fbf73c4239d615936fcdfbd6d08319ba3807303469a0a35d1","JOSÉ DONIZETE VICENTE"],["a89d6642c31c33525be583f4333b37d260d14903319a846e4f1e9e091a978592","VANDERLEI DE OLIVEIRA MORAES"],["aae9ee5b6b7b41c2528dec1714e2b385d69b8c7dde33e6fea8c8973a99a49c7a","RYAN DE LIMA DOS SANTOS"],["ad723f42c7aba316d944f19f340ce47d8e0c6fb354d212736ec4782314a6824a","RODRIGO MENEZES CARDOSO"],["adde7bf0e33b11361d40f4de29102a7c23e91a14078409b597701c7cb2134204","ANTONIO RAFAEL PEREIRA DIAS"],["af027c99e4a2e18ae3b29f40189ca65e3f08f4f23d7d5271c9fcddf8fa64a4bc","ANDERSON DOS SANTOS BARRIOS"],["af9d0081b52194599da95da40beac2d1ce5a2ae2d894c6c08dca0c019277aa10","LEANDRO DAVI DE SOUZA FRAZAO"],["b18a5e6b50af3073f63ac2c4ee837a7c9c6f06d7e91206980283509e3738311e","LEVI DE OLIVEIRA COSTA"],["b1ab1e892617f210425f658cf1d361b5489028c8771b56d845fe1c62c1fbc8b0","GABRIEL DE OLIVEIRA ROSA"],["b20a51d1d0cd4d4e2f5c6f6b9939e8a4d4db0fb202efc513a8e1cddf9021bf4e","VINICIUS WILLIAN LEITE PERUSSE"],["b7b99ba738afaaf923fa742a27b26940a9c5e327507b1660cc4de9d72ff19d78","Administrador 1502"],["b8dc2c143be8994682b08461f46487e05874e59dd9ab65cf973e3a3c67a763aa","DANILO ALVES DE LIMA"],["bcb1ac2aaaf1d367b9fd960eb0cee5709a3fd9d0c99a53b19795a32588353c3b","MATHEUS WELLIGTON DO CARMO"],["bef7b4d1c3d67bc9afe768889cf3f250aff4eb21b587cc806e6f9f793ef86bcb","JULIO SANTOS ALVES NUNES"],["bf7f42e134799ab418870cf6f269c6befb5e2b0265bfbe682db8c7080b922308","MARCOS PAULO DE AZEVEDO FILHO"],["c00cf031587d12c309358e85de8876b2738d3ef2cadd88db6b07318ea0ba8973","ALEXANDRE DUARTE DA SILVA RAMOS"],["c49b0dece16c3a6b89be2938c6fef6d0c91783c0d1b4176a23a0fe6d7f8ad0ba","WANDERSON LUIZ ANDRADE DA SILV"],["c5d4a63dbef4f919bd9cb1690deb3aa0eca57e71fc9af9570465852e2e91357c","GILMAR LANDIM"],["c6437e0ba0560952cb942343f521c60fc3f2247dd1aebf95460c1a070b263051","FRANCISCO FERREIRA DA LUZ"],["c73c63198a1338f0d19547e3d07db9dc25babedc30ae35b80426d48afe73624c","Fabio Henrique Correia"],["cba28b89eb859497f544956d64cf2ecf29b76fe2ef7175b33ea59e64293a4461","MARCOS FELIPE CORTEZ DA ROCHA"],["ce63ea0809ce32335dd7692f1e0c6c5f3493f2b4039351662b60741de4d9a9bd","VLADEMIR MANDU DE MOURA"],["cf085574d40ec95878b1c306a9b2432d86c05f888edc87a39708000b3e58b5f9","VAGNER TEODORO GONCALVES"],["cf1881df6f1696c2e59b47fde80838e66a1dfad4f0e993fd686186333456b55d","LUCAS BATISTA"],["d1b0b7687f7bca92ee389cc396c7752314fd7d6261f6d509fe8227b7dc7cf072","JOHN DE JESUS"],["d1f1775ac1327fc68a4e0a3d4eef9e450429cbfc8ab3fa9a1a39dc8dc67749a7","JULIO SANTOS ALVES NUNES"],["d2675c478d2ce4c97607e30cb39181e633d9b51caf7d3443180fae3911119297","GABRIEL TALARICO DA SILVA"],["d6723fa996ced47773f2dea29cce9b11f951e6dafe321a84ac7d32791c3b4660","RAFAEL DE ANDRADE DOS SANTOS"],["d740238f374425d95f71dcd05dd1486800f0887790b992b74ef41fbb5c8e1167","JONATHAN LEANDRO DE MELO RODRIGUES"],["d8912eba4a0d0a84a3a27ea0773cdda1c857405f98a364c24ff90ada430ba537","MARIA ALICE DUTRA FERRAZ THOME"],["d8ec3903c81cc4f2c290f744a6b591d889b21aa885a469871a7c55d1732200d3","RAFAEL FERNANDES DE OLIVEIRA TEIXEIRA"],["d9521266ec778d833335b0e9d88bd2886bcebb34855da505d02a9db68083c315","LUCAS MATHEUS ROQUE DOS SANTOS"],["da28719dfd9c4da81f433d4788c3d0e10d97180018d0e32b65c967c45661597e","ROBSON DA SILVA INACIO"],["daab3aa68185b677bd3c8d63f12e48eacb0851d98d635137e531fd579a452486","GABRIEL GOMES MACHADO"],["dc4bc886825c446e6ae02d4d0c6a8787af0395079effcc3afc0f8bdc40cbd161","FERNANDO LUIZ FILHO"],["e0ccc43c9b15159c7ad914a982102e0aec234815b4b64f180e0a89ac92490489","JOSE LEONCIO TOMAZ BARBOSA"],["e2135c76ca7863e51154829de3d9cb0a8f6398d31518c7581d370ed9cc521811","FLÁVIO MARTINS DA ROCHA"],["e5ce886c0b0869006dc9a2da28fcd4f1f291f4a90835b75edb74587b66e5acc9","MARLON OLIVEIRA PEREIRA"],["e64474fd91f16a0891fb1de23dff06e8bd0a0ee495f1add2ec08a07f1fb63bb4","EVANDRO FERNANDES CUSTODIO"],["e8026bda3ea2eedc7dc7bce9daa640f8cc0f33e335bd73d986a872b3ba789c71","NICOLAS ANSELMO DA SILVA MACEDO"],["eb5af8ab99b55cda453f70e6a92c7b327bd8f76f49ff6a81c18ade4c26690057","RODRIGO COSTA"],["eb861137efa007794537eac2795cec2e0f87e13e4dce41b303cc45d9794761ed","MESSIAS JOSE DA SILVA"],["ec2f62c81490e1293397a7997058b2325b2cbf48f88defa2df5f1c0b93fa0e81","RAFAEL OLIVEIRA PACHECO"],["ec3f1e361fe23b5ec31edc081aef4c1d6e9bdd184a7b92df4b7111745fa3a164","ANGELO RAFAEL BOZA"],["ee0d6c299a70d20946c1bbdba7e14d32bd0214291344fad4a050f42e0197f866","JOÃO PAULO PAES DOS SANTOS SANCHES"],["f06ca10f4977ea7a4857646c826cc9d4b5fa691e2c57766a98ed93dc6001ecde","Jose Henrique Pereira Braga"],["f2bdda2192b2a979569c4ccbd78d665175e0225c0435031d1341f9cf8021606e","Everton Donizete Dos Santos"],["f7ac69722a0706c533afa393b1574a761a073df0a8280094d3500a4bbc9c2877","NICOLE FERREIRA FERNANDES"],["f7ec2d2600c8998dd7ebb42ea2367dc30615d60a801383b4bcb319a5b376e6aa","JOAO PAULO NEVES DE ASSIS"],["f8b4b02c09cf57b204db3b18aa763786d15574ec0824e3639e10afc54990d52d","HALISON ALMEIDA CASTRO"],["fa66df2f99cec3fe2cb72c2286083c4cbf0897f9697d0a63f142a46138610a86","Robson Aparecido De Souza Teix"]]);

  function normalize(value) {
    return String(value || '').replace(/\D/g, '');
  }

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const result = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(result), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .simec-login{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:24px;background:linear-gradient(145deg,#eef4f8,#dce9f1);font-family:"Segoe UI",Arial,sans-serif;color:#172d42}
      .simec-login-card{width:min(430px,100%);background:#fff;border-radius:16px;padding:34px;box-shadow:0 24px 70px #0b294033;border-top:5px solid #151e75}
      .simec-login-logo{display:block;width:min(310px,100%);height:auto;margin:22px auto 24px}
      .simec-login h1{text-align:center;margin:0;color:#151e75;font-size:25px;letter-spacing:.8px;line-height:1.25}
      .simec-login h1 span{display:block;font-size:18px;margin-top:5px;letter-spacing:1.2px}
      .simec-login p{text-align:center;margin:0 0 25px;color:#657482;line-height:1.5}
      .simec-login label{display:block;color:#334b5e;font-size:14px;font-weight:600;margin-bottom:7px}
      .simec-login input{width:100%;height:48px;border:1px solid #b9c8d4;border-radius:8px;padding:10px 13px;font:18px "Segoe UI",Arial,sans-serif;color:#172d42;background:#fff}
      .simec-login input:focus{outline:3px solid #55ace055;border-color:#1677ad}
      .simec-login button{width:100%;height:48px;margin-top:15px;border:0;border-radius:8px;background:#151e75;color:#fff;font:600 16px "Segoe UI",Arial,sans-serif;cursor:pointer}
      .simec-login button:hover{background:#252f94}
      .simec-login-error{min-height:22px;margin:12px 0 0!important;color:#b3261e!important;font-size:14px}
      .simec-session{position:fixed;right:14px;bottom:14px;z-index:2147483645;display:flex;align-items:center;gap:12px;max-width:calc(100vw - 28px);border:1px solid #c4d1dc;border-radius:9px;padding:8px 9px 8px 14px;background:#fff;color:#173347;font:600 13px "Segoe UI",Arial,sans-serif;box-shadow:0 3px 12px #0b294022}
      .simec-welcome{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .simec-logout{border:0;border-radius:6px;padding:7px 11px;background:#151e75;color:#fff;font:600 13px "Segoe UI",Arial,sans-serif;cursor:pointer;white-space:nowrap}
      .simec-logout:hover{background:#252f94}
      @media(max-width:520px){.simec-login-card{padding:27px 22px}.simec-login h1{font-size:24px}}
    `;
    document.head.appendChild(style);
  }

  function addSession() {
    document.querySelector('.simec-session')?.remove();
    const session = document.createElement('div');
    session.className = 'simec-session';
    const welcome = document.createElement('span');
    welcome.className = 'simec-welcome';
    welcome.textContent = `Bem-vindo, ${sessionStorage.getItem(NAME_KEY) || 'Funcionário'}`;
    const button = document.createElement('button');
    button.className = 'simec-logout';
    button.type = 'button';
    button.textContent = 'Sair do portal';
    button.addEventListener('click', () => {
      sessionStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(NAME_KEY);
      sessionStorage.removeItem(ID_KEY);
      location.href = 'index.html';
    });
    session.append(welcome, button);
    document.body.appendChild(session);
  }

  function unlock() {
    document.documentElement.classList.remove('auth-pending');
    addSession();
  }

  function showLogin() {
    document.documentElement.classList.remove('auth-pending');
    document.body.style.overflow = 'hidden';
    Array.from(document.body.children).forEach(element => {
      element.inert = true;
      element.dataset.simecLocked = 'true';
    });
    const overlay = document.createElement('div');
    overlay.className = 'simec-login';
    overlay.innerHTML = `<form class="simec-login-card">
      <h1>PORTAL DE INDICADORES<span>PLANTA 2 SIMEC</span></h1>
      <img class="simec-login-logo" src="assets/grupo-simec-logo.png" alt="Grupo SIMEC — Construindo o futuro">
      <p>Digite sua matrícula nos dois campos para acessar os painéis.</p>
      <label for="simec-matricula">Matrícula</label>
      <input id="simec-matricula" name="matricula" inputmode="numeric" autocomplete="username" required autofocus>
      <label for="simec-senha" style="margin-top:14px">Senha</label>
      <input id="simec-senha" name="senha" type="password" inputmode="numeric" autocomplete="current-password" required>
      <button type="submit">Entrar</button>
      <p class="simec-login-error" role="alert" aria-live="polite"></p>
    </form>`;
    document.body.appendChild(overlay);
    const form = overlay.querySelector('form');
    const input = overlay.querySelector('input');
    const password = overlay.querySelector('#simec-senha');
    const error = overlay.querySelector('.simec-login-error');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const matricula = normalize(input.value);
      const senha = normalize(password.value);
      const matriculaHash = matricula ? await digest(matricula) : '';
      if (matricula && senha === matricula && USERS.has(matriculaHash)) {
        sessionStorage.setItem(ACCESS_KEY, 'ok');
        sessionStorage.setItem(NAME_KEY, USERS.get(matriculaHash));
        sessionStorage.setItem(ID_KEY, matricula);
        document.body.style.overflow = '';
        overlay.remove();
        document.querySelectorAll('[data-simec-locked="true"]').forEach(element => {
          element.inert = false;
          delete element.dataset.simecLocked;
        });
        addSession();
      } else {
        error.textContent = 'Matrícula ou senha inválida. Digite sua matrícula nos dois campos.';
        input.select();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    if (sessionStorage.getItem(ACCESS_KEY) === 'ok') unlock();
    else showLogin();
  });
})();
