import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image 
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Création des styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333333'
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    width: 120
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  quoteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0066CC'
  },
  quoteNumber: {
    fontSize: 12,
    color: '#666666'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#F5F5F5'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5
  },
  column: {
    flex: 1
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#CCCCCC'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
    fontWeight: 'bold',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC'
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC'
  },
  tableHeaderDescription: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC'
  },
  tableHeaderQuantity: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC',
    textAlign: 'center'
  },
  tableHeaderUnitPrice: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC',
    textAlign: 'right'
  },
  tableHeaderTotal: {
    width: '20%',
    textAlign: 'right'
  },
  tableCellDescription: {
    width: '50%'
  },
  tableCellQuantity: {
    width: '15%',
    textAlign: 'center'
  },
  tableCellUnitPrice: {
    width: '15%',
    textAlign: 'right'
  },
  tableCellTotal: {
    width: '20%',
    textAlign: 'right',
    borderRightWidth: 0
  },
  totals: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10
  },
  totalRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5
  },
  totalLabel: {
    width: 120,
    textAlign: 'right',
    marginRight: 10
  },
  totalValue: {
    width: 80,
    textAlign: 'right'
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0066CC'
  },
  paymentSchedule: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 5
  },
  paymentScheduleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  },
  paymentRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: '1px solid #CCCCCC',
    fontSize: 10,
    color: '#666666',
    textAlign: 'center'
  },
  notes: {
    marginTop: 20,
    fontSize: 10,
    fontStyle: 'italic'
  }
});

/**
 * Composant de document PDF pour les devis
 * Permet de générer un devis au format PDF
 */
const QuotePDFDocument = ({ quoteData }) => {
  if (!quoteData) return null;
  
  // Simuler les éléments de devis s'ils n'existent pas
  const items = quoteData.items || [
    {
      description: 'Climatiseur Airton ReadyClim - ' + (quoteData.configuration?.modelType || 'Mono-split'),
      quantity: 1,
      unitPrice: quoteData.subtotal * 0.7, // Simulation du prix unitaire
      totalPrice: quoteData.subtotal * 0.7
    },
    {
      description: 'Liaison frigorifique pré-chargée en gaz R32 - ' + (quoteData.configuration?.length || '6m'),
      quantity: 1,
      unitPrice: quoteData.subtotal * 0.15, // Simulation du prix unitaire
      totalPrice: quoteData.subtotal * 0.15
    },
    {
      description: 'Installation standard',
      quantity: 1,
      unitPrice: quoteData.subtotal * 0.15, // Simulation du prix unitaire
      totalPrice: quoteData.subtotal * 0.15
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '';
    return value.toFixed(2).replace('.', ',') + ' €';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête du document */}
        <View style={styles.header}>
          <View>
            {/* Logo ou nom de l'entreprise */}
            <Text style={styles.quoteTitle}>AIRTON INSTALLATION</Text>
            <Text>Service d'installation de climatisation</Text>
            <Text>33320 Eysines</Text>
            <Text>Tél: 05.XX.XX.XX.XX</Text>
            <Text>Email: contact@airton-installation.fr</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quoteTitle}>DEVIS</Text>
            <Text style={styles.quoteNumber}>N° {quoteData.quoteNumber}</Text>
            <Text>Date: {formatDate(quoteData.date)}</Text>
            <Text>Valable jusqu'au: {formatDate(quoteData.expiryDate)}</Text>
          </View>
        </View>

        {/* Informations client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS CLIENT</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>
                <Text style={styles.label}>Nom:</Text> {quoteData.customer?.firstName} {quoteData.customer?.lastName}
              </Text>
              <Text>
                <Text style={styles.label}>Adresse:</Text> {quoteData.customer?.address}
              </Text>
              <Text>{quoteData.customer?.postalCode} {quoteData.customer?.city}</Text>
            </View>
            <View style={styles.column}>
              <Text>
                <Text style={styles.label}>Email:</Text> {quoteData.customer?.email}
              </Text>
              <Text>
                <Text style={styles.label}>Téléphone:</Text> {quoteData.customer?.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Détails du devis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DÉTAILS DU DEVIS</Text>
          <View style={styles.table}>
            {/* En-tête du tableau */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableHeaderDescription}>Description</Text>
              <Text style={styles.tableHeaderQuantity}>Quantité</Text>
              <Text style={styles.tableHeaderUnitPrice}>Prix unitaire</Text>
              <Text style={styles.tableHeaderTotal}>Total</Text>
            </View>

            {/* Lignes du tableau */}
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellDescription]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.tableCellQuantity]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.tableCellUnitPrice]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, styles.tableCellTotal]}>{formatCurrency(item.totalPrice)}</Text>
              </View>
            ))}
          </View>

          {/* Totaux */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total:</Text>
              <Text style={styles.totalValue}>{formatCurrency(quoteData.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA (20%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(quoteData.tax)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, styles.grandTotal]}>Total TTC:</Text>
              <Text style={[styles.totalValue, styles.grandTotal]}>{formatCurrency(quoteData.total)}</Text>
            </View>
          </View>
        </View>

        {/* Échéancier de paiement */}
        <View style={styles.paymentSchedule}>
          <Text style={styles.paymentScheduleTitle}>ÉCHÉANCIER DE PAIEMENT</Text>
          <View style={styles.paymentRow}>
            <Text>Premier paiement (40% à la commande):</Text>
            <Text>{formatCurrency(quoteData.installmentPayments?.firstPayment)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text>Deuxième paiement (30% le jour du rendez-vous):</Text>
            <Text>{formatCurrency(quoteData.installmentPayments?.secondPayment)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text>Troisième paiement (30% post-installation):</Text>
            <Text>{formatCurrency(quoteData.installmentPayments?.thirdPayment)}</Text>
          </View>
        </View>

        {/* Notes et conditions */}
        <View style={styles.notes}>
          <Text>Devis préparé par Airton Installation.</Text>
          <Text>Les prix indiqués sont TTC (TVA 20% incluse).</Text>
          <Text>Le délai d'installation est généralement de 7 à 10 jours ouvrés après validation du devis et réception du premier paiement.</Text>
          <Text>Installation garantie 1 an. Matériel garanti 3 ans par le fabricant Airton.</Text>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Airton Installation - SIRET: XXXXXXXXXXX - www.airton-installation.fr</Text>
          <Text>Ce devis est valable 30 jours à compter de sa date d'émission.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDFDocument;
