Documentation de l'API Orange Money & MTN Money (Cameroun)
Intégrez les paiements Orange Money et MTN Mobile Money directement dans votre application en utilisant notre API Web.

Lancement d'une demande de paiement
Pour lancer un paiement, envoyez une requête POST à notre point d'accès d'initiation de paiement avec la charge utile JSON suivante :

Méthode HTTP

POST https://www.dklo.co/api/tara/cmmobile

{
  "apiKey": "uDR0yGzEoFBKDAIT3oQMQyZc",
  "businessId": "TcMpnFWlIz",
  "productId": "product-456",
  "productName": "Nom du produit",
  "productPrice": 100,
  "phoneNumber": "6xxxxxxxx",
  "webHookUrl": "https://example.com/webhook"
}

apiKey – Votre clé API publique fournie par Taramoney.
businessId – Votre identifiant d'entreprise unique chez Taramoney.
productId – Un identifiant unique pour le produit ou le service acheté.
productName – Le nom du produit ou du service.
productPrice – Le prix du produit ou du service en FCFA (entier).
PhoneNumber – Le numéro de téléphone qui effectue le paiement.
webHookUrl – L'URL où Taramoney enverra une requête POST pour vous notifier du statut du paiement.

Réponse de l'API
Après un lancement réussi, l'API répondra avec un objet JSON contenant le code USSD que l'utilisateur doit composer :

{
  "message": "API_ORDER_SUCESSFULL",
  "status": "SUCCESS",
  "ussdCode": "#150*50#",
  "vendor": "ORANGE_CAMEROON"
}

message – Un message de statut (par exemple, "API_ORDER_SUCESSFULL").
status – Le statut du lancement de la requête. (SUCCESS ou FAILURE).
ussdCode – Le code USSD que l'utilisateur doit composer pour finaliser le paiement. (#150*50# pour Orange Cameroun).
vendor – L'opérateur de Mobile Money. (ORANGE_CAMEROON ou MTN_CAMEROON).

Notification de Webhook
Une fois que l'utilisateur a finalisé le processus de paiement (avec ou sans succès), Taramoney enverra une requête POST à l'URL webHookUrl que vous avez fournie.. La charge utile sera au format suivant ::

{
  "businessId": "TcMpnFWlIz",
  "paymentId": "awerSxlerxrfrt-6",
  "collectionId": "456641929164",
  "phoneNumber": "696717597",
  "creationDate": "2025-07-24T15:28:53.678+02:00",
  "changeDate": "2025-07-24T15:28:53.678+02:00",
  "status": "SUCCESS"
}

businessId – Votre identifiant d'entreprise chez Taramoney.
paymentId – L'identifiant unique de cette transaction de paiement spécifique.
collectionId – L'identifiant de la collecte/du produit auquel ce paiement est lié.
phoneNumber – Le numéro de téléphone utilisé pour la transaction Mobile Money.
creationDate – L'horodatage de la création de la demande de paiement.
changeDate – L'horodatage de la dernière mise à jour du statut du paiement.
status – Le statut final du paiement.: SUCCESS ou FAILURE.

