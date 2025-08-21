
import { useLocation } from 'wouter';

export default function Legal() {
  const [location] = useLocation();
  const isTerms = location === '/cgv';
  const isPrivacy = location === '/mentions-legales';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isTerms && (
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Conditions Générales de Vente
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions générales de vente (CGV) régissent l'utilisation de la plateforme AppelsPro,
              service de mise en relation entre clients et prestataires de services.
            </p>

            <h2>2. Acceptation des conditions</h2>
            <p>
              L'utilisation de la plateforme AppelsPro implique l'acceptation pleine et entière des présentes CGV.
              Ces conditions sont accessibles à tout moment sur le site et prévaudront sur toute autre document.
            </p>

            <h2>3. Description du service</h2>
            <p>
              AppelsPro propose deux services principaux :
            </p>
            <ul>
              <li><strong>Appels d'offres inverses :</strong> Publication de projets et réception d'offres de prestataires</li>
              <li><strong>Mise en relation directe :</strong> Contact direct avec des professionnels spécialisés</li>
            </ul>

            <h2>4. Inscription et compte utilisateur</h2>
            <p>
              L'inscription sur la plateforme est gratuite. L'utilisateur s'engage à fournir des informations exactes
              et à maintenir ses données à jour. Chaque utilisateur est responsable de son compte et de ses activités.
            </p>

            <h2>5. Obligations des utilisateurs</h2>
            <h3>5.1 Clients</h3>
            <ul>
              <li>Fournir des descriptions précises et complètes des projets</li>
              <li>Respecter les prestataires et leurs propositions</li>
              <li>Honorer les engagements pris lors de l'acceptation d'une offre</li>
            </ul>
            
            <h3>5.2 Prestataires</h3>
            <ul>
              <li>Proposer des services conformes à leurs compétences</li>
              <li>Respecter les délais et engagements pris</li>
              <li>Fournir des prestations de qualité professionnelle</li>
            </ul>

            <h2>6. Tarification</h2>
            <p>
              L'utilisation de base de la plateforme est gratuite. Des services premium pourront être proposés
              ultérieurement avec une tarification spécifique qui sera communiquée aux utilisateurs.
            </p>

            <h2>7. Responsabilité</h2>
            <p>
              AppelsPro est un intermédiaire technique facilitant la mise en relation. La plateforme n'est pas
              responsable de la qualité des prestations, des litiges entre utilisateurs, ou des dommages
              résultant de l'utilisation du service.
            </p>

            <h2>8. Propriété intellectuelle</h2>
            <p>
              Tous les éléments de la plateforme (design, textes, logos) sont protégés par le droit d'auteur.
              Les utilisateurs conservent leurs droits sur les contenus qu'ils publient.
            </p>

            <h2>9. Résiliation</h2>
            <p>
              Les utilisateurs peuvent supprimer leur compte à tout moment. AppelsPro se réserve le droit
              de suspendre ou supprimer un compte en cas de violation des présentes conditions.
            </p>

            <h2>10. Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français
              seront seuls compétents.
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      )}

      {isPrivacy && (
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Mentions Légales
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. Éditeur du site</h2>
            <p>
              <strong>AppelsPro</strong><br />
              Plateforme de mise en relation professionnelle<br />
              [Adresse à compléter]<br />
              Email : contact@appelspro.fr<br />
              Téléphone : [À compléter]
            </p>

            <h2>2. Hébergement</h2>
            <p>
              Ce site est hébergé par :<br />
              <strong>Replit, Inc.</strong><br />
              767 Bryant St. #203<br />
              San Francisco, CA 94107<br />
              États-Unis
            </p>

            <h2>3. Protection des données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
              vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant.
            </p>
            
            <h3>3.1 Données collectées</h3>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Informations de profil professionnel</li>
              <li>Données de navigation (cookies techniques)</li>
            </ul>

            <h3>3.2 Finalité du traitement</h3>
            <ul>
              <li>Gestion des comptes utilisateurs</li>
              <li>Mise en relation entre clients et prestataires</li>
              <li>Amélioration du service</li>
              <li>Communication liée au service</li>
            </ul>

            <h3>3.3 Conservation des données</h3>
            <p>
              Les données personnelles sont conservées pendant la durée nécessaire aux finalités
              pour lesquelles elles sont collectées, et au maximum 3 ans après la dernière activité.
            </p>

            <h2>4. Cookies</h2>
            <p>
              Le site utilise uniquement des cookies techniques nécessaires au fonctionnement de la plateforme.
              Aucun cookie de tracking ou publicitaire n'est utilisé.
            </p>

            <h2>5. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français.
            </p>

            <h2>6. Contact</h2>
            <p>
              Pour toute question relative à ces mentions légales ou à la protection de vos données,
              vous pouvez nous contacter à : <strong>contact@appelspro.fr</strong>
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      )}

      {!isTerms && !isPrivacy && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Informations Légales
          </h1>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <a 
              href="/cgv"
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Conditions Générales de Vente
              </h2>
              <p className="text-gray-600">
                Consultez nos conditions d'utilisation et modalités de service
              </p>
            </a>
            <a 
              href="/mentions-legales"
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mentions Légales
              </h2>
              <p className="text-gray-600">
                Informations légales et politique de confidentialité
              </p>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
