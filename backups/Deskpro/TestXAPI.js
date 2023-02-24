import xapi from 'xapi';



/*
xapi.Event.Message.Send.on(event => {
  console.log(event.Text);
});



const command = "Command Message Send";


xapi.Command.Message.Send({ text: "test" });


function getCall(command) {
  var call = xapi;
  for (const word of command.split(' ')) {
    call = call[word];
  }
  return call;
}

let call = getCall(command);
//console.log(call);
call({ text: 'moo' });

xapi['Command']['Message']['Send']({ text: 'testttttttttttt' });


*/

const CHUNK_TYPE_FIRST = 1;
const CHUNK_TYPE_PART = 2;
const CHUNK_TYPE_LAST = 3;
const CHUNK_TYPE_SINGLE = 4;
const REQUEST_TYPE_CALL = 1;
const REQUEST_TYPE_GET = 2;
const REQUEST_TYPE_THEN = 3;
const REQUEST_TYPE_ON = 4;


const teststruct = {
  e: 'master',
  f: 423674523,
  t: REQUEST_TYPE_CALL,
  p: 'Command.Message.Send',
  a: {
    text: `Après avoir « déclaré la guerre » à Apple et accusé la marque à la pomme de tous les maux, Elon Musk a assuré mercredi que le « malentendu » était résolu. 

• À lire aussi: Elon Musk affirme qu'Apple a menacé de supprimer Twitter de son App Store

Le nouveau propriétaire de Twitter a remercié Tim Cook, le patron d’Apple, de lui avoir fait visiter le « très beau siège » du groupe dans la Silicon Valley.

« Bonne conversation. Entre autres choses, nous avons résolu le malentendu au sujet de la possibilité que Twitter soit retiré de l’App Store. Tim a dit clairement qu’Apple n’avait jamais envisagé de le faire », a résumé Elon Musk dans un autre tweet.

Lundi, le tempétueux entrepreneur avait affirmé qu’Apple « menaçait » de retirer Twitter de son App Store, et « refusait » de « dire pourquoi », après une série de tweets belliqueux reprochant au fabricant de l’iPhone de faire de la « censure » et d’abuser de sa position dominante sur le marché.

L’emportement du milliardaire intervenait alors que la relance de son projet phare, « Blue Verified », prévue pour vendredi a été reportée, d’après la newsletter spécialisée The Platformer.

Blue Verified, le nouvel abonnement à Twitter pour huit dollars par mois, mélange une formule payante existante (pour bénéficier d’avantages pratiques) et l’authentification des comptes, jusqu’à présent gratuite et réservée aux personnalités et organisations.

Son déploiement initial le 9 novembre s’est traduit par une éruption de faux comptes se faisant passer notamment pour des sportifs, des entreprises et Elon Musk lui-même. Il a été suspendu au bout de deux jours.

Mais même s’il est bien mis en place, 30 % du montant reviendra de fait à Apple et à Google, qui contrôlent les deux principaux systèmes d’exploitation mobiles, iOS et Android.

Toutes les applications mobiles qui veulent être présentes sur les smartphones doivent respecter les règles très similaires des deux entreprises américaines, de la modération des contenus au paiement d’une commission de 15 % à 30 % sur toutes les dépenses des utilisateurs.

Sur les iPhone, l’App Store d’Apple est incontournable.

Elon Musk a accusé le groupe de Tim Cook de « supprimer secrètement la liberté d’expression » et d’appliquer une « taxe secrète de 30 % ».

Mais il « a clairement besoin d’argent » et il « fait une crise parce qu’il ne veut pas payer Apple », estime l’analyste indépendant Rob Enderle.

L’entrepreneur n’est pas le premier à s’insurger contre la « taxe Apple », comme la surnomment ses nombreux détracteurs. 

Le patron de Spotify est ainsi monté au créneau mercredi sur Twitter, accusant à nouveau Apple de « s’accorder tous les avantages tout en nuisant à l’innovation et aux consommateurs ».`
  }
}

var tsstring = JSON.stringify(teststruct);

var b64ts = btoa(tsstring);
console.log(b64ts);

const Endpoint = (ip) => {
  return ({
    xapi: (path, args) => {
      console.log(path.toString());
      return ({
        then: {

        },
        get: {

        }
      });
    }
  });
}

function getMessageXML(data) {
  //return (`<Command><Message><Send><Text>${btoa(JSON.stringify(data))}</Text></Send></Message></Command>`);
  return (btoa(JSON.stringify(data)));
}

function buildRequest(reqobj) {
  let buffer = [];
  let id = Math.floor(Math.random() * 100000);
  let jsonreq = JSON.stringify(reqobj);
  jsonreq = jsonreq.match(/.{1,600}/g);
  console.log(`Request ${JSON.stringify(reqobj)}`);
  console.log(`Will be splitted into ${jsonreq.length} parts`);
  if (jsonreq.length > 1) {
    let tempbuffstart = {
      t: CHUNK_TYPE_FIRST,
      i: id,
      d: jsonreq[0]
    };
    console.log(`CHUNK (FIRST) = ${JSON.stringify(tempbuffstart)}`);
    buffer.push(getMessageXML(tempbuffstart));

    for (var i = 1; i < jsonreq.length - 1; i++) {
      let tempbuffpart = {
        t: CHUNK_TYPE_PART,
        i: id,
        d: jsonreq[i]
      }
      console.log(`CHUNK (PART) = ${JSON.stringify(tempbuffpart)}`);
      buffer.push(getMessageXML(tempbuffpart));
    }
    let tempbuffend = {
      t: CHUNK_TYPE_LAST,
      i: id,
      d: jsonreq[jsonreq.length - 1]
    }
    console.log(`CHUNK (END) = ${JSON.stringify(tempbuffend)}`);
    buffer.push(getMessageXML(tempbuffend));
  }
  else {
    let tempbuffsingle = {
      t: CHUNK_TYPE_SINGLE,
      i: id,
      d: jsonreq[0]
    }
    console.log(`CHUNK (SINGLE) = ${JSON.stringify(tempbuffsingle)}`);
    buffer.push(getMessageXML(tempbuffsingle));
  }


  for (const b of buffer) {
    console.log(`ENCODED_CHUNK_LENGTH=${b.length} REQ_DATA=${b}`);
  }

  unpack(buffer);

}

buildRequest(teststruct);


function unpack(data) {
  for (var part of data) {
    console.log(atob(part));
    //let obj = JSON.parse(part);
    
    //console.log(obj);
  }
}

/*


const myEndpoint = Endpoint('1.1.1.1', 'user', 'pass');
myEndpoint.xapi('Command.Message.Send', { Text: 'test!!!!' });

myEndpoint.xapi('Status.Webex.Status').then(status => {
  console.log(status);
});



myEndpoint.xapi('Status.Webex.Status').get();
*/





//let x = Endpoint('10.12.48.117');
//x.test();


xapi.Command.HttpClient.Post({
  AllowInsecureHTTPS: true,
  Header: ['Authorization: Basic emFnaWc6SWVpZG0yZisr'],
  Timeout: 5,
  Url: 'https://10.12.48.117/putxml',
},
  `
 <Command>
<Message>
<Send>
<Text>
test!
</Text>
</Send>
 </Message>
</Command>
`
).then(result => {
  //console.log(result);
}).catch(err => {
  //console.error(err);
});