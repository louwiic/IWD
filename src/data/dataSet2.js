import { useEffect, useState } from "react";

const UseChartData2 = () => {
  const [chartData2, setChartData2] = useState(null);

  const fetchData = async () => {
    const labels = [
      "Leader",
      "Qualités",
      "Efforts",
      "Potentiel",
      "Satisf-Pro",
      "Dev-Pro",
      "Amitié",
      "Honnêteté",
      "Créativité",
      "Apprentissa",
      "Plaisir",
      "Responsabil",
      "Organis",
      "Réalisation",
      "Reconnaiss",
      "Richesse",
      "Sécurité",
      "Tranqui",
      "Passion",
      "Action",
      "Atteindre",
      "Risque",
      "Réussir",
      "Complexité",
      "Impact",
      "Emotion",
      "Discipline",
      "Ecoute",
      "Preparer",
      "Comprendre",
      "Comm-Details",
      "Feedback",
      "Ressenti",
      "Comm-Ecrite",
      "Stress-Mgt",
      "Expri-Conf",
      "Démo-Conf",
      "Information",
      "Délég-Autor",
      "Maint-Limit",
      "Tenir-Parol",
      "Admet-Err",
      "Appliq-Comp",
      "Conf-Autres",
      "Vengeance",
      "Repon-Contruc",
      "Partg-Emoti",
      "Innov-Creat",
      "Rôle",
      "Opportunité",
      "Optimiste",
      "Humour",
      "Quali-Soutien",
      "Prendr-soin",
      "Collaboratio",
      "Degre",
      "Rebondir",
      "Adapt-Chang",
      "Orig-Stress",
      "Agir-Authta",
      "Defis-Perso",
      "Atouts",

      "Adap-Tecno",
      "Complétude",
      "Vie Privée",
      "Cohérence",
      "Souhai-Être",
      "Ruminer",
      "Adversité",
      "Negativité",
      "Image-Projt",
      "Crainte",
      "Epanouiss",
      "Paix-Inter",
      "Regard-Soi",
      "Spirituel",
      "Mental",
      "Physique",
      "Amélior-Prata",
      "Incertitude",
      "Contribuer",
      "Curiosité",
      "Mgt-Ambig",
      "Rem-en-quest",
      "Avenir-Clair",
      "Volonté",
    ];

    const meToday = [4, 2, 4, 1, 3, 2]; // Modifié
    const valeurs = [5, 3, 2, 4, 1, 2, 0, 4, 0, 2, 5, 4]; // Modifié
    const ES = [2, 3, 3, 4, 2, 3, 0, 4, 4]; // Modifié
    const CONFLIT = [3, 3, 2, 2, 4, 1, 0, 4, 3, 3]; // Modifié
    const COM = [4, 3, 3, 2, 2, 1, 1, 4]; // Modifié
    const CONFIANCE = [3, 3, 2, 2, 4, 4, 0, 3, 1]; // Modifié
    const RESILIENCE = [4, 3, 2, 2, 1, 4, 3, 3, 1, 0]; // Modifié
    const VOUSMEME = [3, 2, 3, 2, 2, 4, 1, 3, 1, 0, 3, 2, 3, 4, 2, 3]; // Modifié
    const FUTUR = [3, 3, 4, 2, 1, 3, 2]; // Modifié
    const formattedData = {
      labels: labels,
      datasets: [
        {
          label: "Vous aujourd'hui",
          backgroundColor: "transparent",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          borderColor: "rgba(150, 50, 226, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(150, 50, 226, 0.7)",
          pointHoverBackgroundColor: "rgba(150, 50, 226, 0.7)",
          pointHoverBorderColor: "rgba(150, 50, 226, 0.7)",
          data: [...meToday, ...Array(14).fill(Number.NaN)],
        },
        {
          label: "Valeurs",
          backgroundColor: "transparent",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          borderColor: "rgba(135, 0, 0, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(135, 0, 0, 0.7)",
          pointHoverBackgroundColor: "rgba(135, 0, 0, 0.7)",
          pointHoverBorderColor: "rgba(135, 0, 0, 0.7)",
          data: [
            ...Array(meToday.length).fill(Number.NaN),
            ...valeurs,
            ...Array(ES.length).fill(Number.NaN),
          ],
        },
        {
          label: "Etat d'esprit",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: "transparent",
          borderColor: "rgba(0, 38, 142, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(0, 38, 142, 0.7)",
          pointHoverBackgroundColor: "rgba(0, 38, 142, 0.7)",
          pointHoverBorderColor: "rgba(0, 38, 142, 0.7)",
          data: [
            ...Array(meToday.length + valeurs.length).fill(Number.NaN),
            ...ES,
            ...Array(COM.length).fill(Number.NaN),
          ],
        },
        {
          label: "Communication",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: "transparent",
          borderColor: "rgba(226, 50, 50, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(226, 50, 50, 0.7)",
          pointHoverBackgroundColor: "rgba(226, 50, 50, 0.7)",
          pointHoverBorderColor: "rgba(226, 50, 50, 0.7)",
          data: [
            ...Array(ES.length + valeurs.length + meToday.length).fill(
              Number.NaN
            ),
            ...COM,
            ...Array(CONFIANCE.length).fill(Number.NaN),
          ],
        },
        {
          label: "Confiance",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: "transparent",
          borderColor: "rgba(226, 168, 50, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(226, 168, 50, 0.7)",
          pointHoverBackgroundColor: "rgba(226, 168, 50, 0.7)",
          pointHoverBorderColor: "rgba(226, 168, 50, 0.7)",
          data: [
            ...Array(
              ES.length + valeurs.length + meToday.length + COM.length
            ).fill(Number.NaN),
            ...CONFIANCE,
            ...Array(CONFLIT.length).fill(Number.NaN),
          ],
        },
        {
          label: "Conflit",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: "transparent",
          borderColor: "rgba(226, 220, 50, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(226, 220, 50, 0.7)",
          pointHoverBackgroundColor: "rgba(226, 220, 50, 0.7)",
          pointHoverBorderColor: "rgba(226, 200, 50, 0.7)",
          data: [
            ...Array(
              ES.length +
                valeurs.length +
                meToday.length +
                COM.length +
                CONFIANCE.length
            ).fill(Number.NaN),
            ...CONFLIT,
            ...Array(RESILIENCE.length).fill(Number.NaN),
          ],
        },
        {
          label: "Résilience",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: "transparent",
          borderColor: "rgba(168, 220, 50, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(168, 220, 50, 0.7)",
          pointHoverBackgroundColor: "rgba(168, 220, 50, 0.7)",
          pointHoverBorderColor: "rgba(168, 200, 50, 0.7)",
          data: [
            ...Array(
              ES.length +
                valeurs.length +
                meToday.length +
                COM.length +
                CONFIANCE.length +
                CONFLIT.length
            ).fill(Number.NaN),
            ...RESILIENCE,
            //...Array(RESILIENCE.length).fill(Number.NaN),
          ],
        },
        {
          label: "Vous-même",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: "transparent",
          borderColor: "rgba(50, 226, 185, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(50, 226, 185, 0.7)",
          pointHoverBackgroundColor: "rgba(50, 226, 185, 0.7)",
          pointHoverBorderColor: "rgba(50, 200, 185, 0.7)",
          data: [
            ...Array(
              ES.length +
                valeurs.length +
                meToday.length +
                COM.length +
                CONFIANCE.length +
                CONFLIT.length +
                RESILIENCE.length
            ).fill(Number.NaN),
            ...VOUSMEME,
            ...Array(FUTUR.length).fill(Number.NaN),
          ],
        },
        {
          label: "Dans le futur",
          pointBorderWidth: 2,
          pointRadius: 3,
          borderWidth: 2,
          backgroundColor: "transparent",
          borderColor: "rgba(50, 220, 226, 0.7)",
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(50, 220, 226, 0.7)",
          pointHoverBackgroundColor: "rgba(50, 220, 226, 0.7)",
          pointHoverBorderColor: "rgba(50, 200, 226, 0.7)",
          data: [
            ...Array(
              ES.length +
                valeurs.length +
                meToday.length +
                COM.length +
                CONFIANCE.length +
                CONFLIT.length +
                RESILIENCE.length +
                VOUSMEME.length
            ).fill(Number.NaN),
            ...FUTUR,
            ...Array(meToday.length).fill(Number.NaN),
          ],
        },
      ],
    };
    setChartData2(formattedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { chartData2 };
};

export default UseChartData2;
