var xl = require('excel4node');
var express = require('express');
var api = express.Router();
var path = require('path');
var con = require('../conexion.js');
var tiempo = new Date();
var md_auth = require('../middlewares/autenticacion.js');
var md_nivel = require('../middlewares/nivel.js');
//Envíos
api.post('/BillOfLanding', md_nivel.ensureLevel2, function (req, res) {
    info = req.body;
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fecha = new Date(`${info.fecha.split('\/')[2]}`, `${info.fecha.split('\/')[1] - 1}`, `${info.fecha.split('\/')[0]}`)
    fecha.toLocaleDateString('es-MX', options);
    let meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let mes = meses[fecha.getMonth()];
    let comienzo = new Date(fecha.getFullYear(), 0, 0);
    let dif = fecha - comienzo;
    let unDia = 1000 * 60 * 60 * 24;
    let dia = Math.ceil(dif / unDia) - 1;
    let wb = new xl.Workbook();
    let bordeadoNegritas = {
        font: {
            bold: true,
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let AllBorder = {
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let bordeado = {
        font: {
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }

    let bordeadoJustificado = {
        font: {
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'justify',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    var ws = wb.addWorksheet('Sheet 1', {
        pageSetup: {
            paperSize: 'LETTER_PAPER',
            usePrinterDefaults: true,
            fitToWidth: 1
        },
        sheetView: {
            showGridLines: false
        },
        margins: {
            bottom: 0,
            top: 0
        },
        headerFooter: {
            scaleWithDoc: true
        }
    });
    ws.column(1).setWidth(1.57);
    ws.column(2).setWidth(10.14);
    ws.column(3).setWidth(1.14);
    ws.column(4).setWidth(1.14);
    ws.column(5).setWidth(4.86);
    ws.column(6).setWidth(4.86);
    ws.column(7).setWidth(10.71);
    ws.column(8).setWidth(10.71);
    ws.column(9).setWidth(10.71);
    ws.column(10).setWidth(11.43);
    ws.column(11).setWidth(0.67);
    ws.column(12).setWidth(2.43);
    ws.column(13).setWidth(2.43);
    ws.column(14).setWidth(6.57);
    ws.column(15).setWidth(6.57);
    ws.column(16).setWidth(5);
    ws.column(17).setWidth(4.87);
    ws.column(18).setWidth(5.14);
    ws.column(19).setWidth(3.43);
    ws.column(20).setWidth(2);
    ws.column(21).setWidth(8.71);
    ws.column(22).setWidth(6.29);
    ws.column(23).setWidth(1);
    ws.column(24).setWidth(1);
    ws.addImage({
        path: path.join(__dirname, '../client/production/images/QMC_LOGO2.png'),
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: 2,
                colOff: '0.2in',
                row: 1,
                rowOff: '0.05in'
            },
            to: {
                col: 4,
                colOff: 0,
                row: 6,
                rowOff: 0
            }
        }
    });
    ws.addImage({
        path: path.join(__dirname, '../client/production/images/check.png'),
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: 19,
                colOff: '0.2in',
                row: 7,
                rowOff: '0.02in'
            },
            to: {
                col: 19,
                colOff: 0,
                row: 7,
                rowOff: 0
            }
        }
    });
    ws.addImage({
        path: path.join(__dirname, '../client/production/images/check.png'),
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: 22,
                colOff: '0.2in',
                row: 7,
                rowOff: '0.02in'
            },
            to: {
                col: 22,
                colOff: 0,
                row: 7,
                rowOff: 0
            }
        }
    });
    // Encabezado
    ws.cell(1, 1, 4, 6, true).style(bordeado);
    ws.cell(1, 7, 1, 18, true).string('LG.02.01.E').style(bordeadoNegritas);
    ws.cell(1, 19, 1, 23, true).string('Clasificación:B').style(bordeadoNegritas);
    ws.cell(2, 7, 4, 18, true).string('Bill Of Landing').style(bordeadoNegritas);
    ws.cell(2, 19, 2, 23, true).string('Adecuación 1').style(bordeado);
    ws.cell(3, 19, 3, 23, true).string('Revisión 1').style(bordeado);
    ws.cell(4, 19, 4, 23, true).string('Página 1 de 1').style(bordeado);
    // Avisos
    ws.cell(6, 1, 7, 16, true).string('THIS MEMORANDUM is an acknowledgment that a Bill of Landing has been issued and is not the Original Bill of Lading, nor a copy or duplicate, covering the property named herein, and is intended solely for filing or record.').style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }, font: {
            size: 9,
            bold: true,
            name: 'Arial'
        }
    });
    ws.cell(8, 1, 9, 16, true).string('RECEIVED, subject to the classification and lawfully filed tariffs in effect on the date of receipt by the carrier of the property described in the Original Bill of Lading.').style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }, font: {
            size: 7,
            bold: true,
            name: 'Arial'
        }
    });
    ws.cell(10, 1, 13, 23, true).string('The property described below, in apparent good order, except as noted (contents and condition of contents of packages unknown) marked, consigned and destined as indicated below, which said carrier (the word carrier being understood throughout this contract As meaning any person or corporation in possession of the property,  under the contract)  agrees to carry to its usual place of delivery at said destination,  if on its route, otherwise to deliver to another carrier on the route to said destination. It is mutually agreed, As to each carrier of all or any of said property over all or any portion of said route to destination and as to each party at any time interested in all or any of said property, that every service to be performed hereunder shall be subject to all the terms and conditions Of the Uniform Domestic Straight Bill of Lading set forth (1) in Uniform Freight Classification in effect on the date hereof, if this is a rail or a rail-water shipment, or (2) in the applicable motor carrier classification or tariff if this is a motor carrier shipment.').style({
        alignment: {
            wrapText: true,
            horizontal: 'justify',
            vertical: 'center'
        },
        font: {
            name: 'Arial',
            size: 8
        }
    });
    ws.cell(14, 1, 16, 23, true).string('Shipper hereby certifies that he is familiar with all the terms and conditions of the said bill of lading, including those on the back thereof, set forth in the classification or tariff which govern the transportation of this shipment and the said terms And conditions are hereby agreed to by the shipper and accepted for himself and his assigns.').style({
        alignment: {
            wrapText: true,
            horizontal: 'justify',
            vertical: 'center'
        },
        font: {
            name: 'Arial',
            size: 8,
            bold: true
        },
        border: {
            bottom: {
                style: 'medium',
                color: '#000000'
            }
        }
    });
    ws.cell(6, 17, 6, 23, true).string('DESIGNATE WITH AN (X)').style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        font: {
            name: 'Arial',
            size: 12
        }
    });
    ws.cell(7, 17, 8, 19, true).string('BY TRUCK').style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        font: {
            name: 'Arial',
            size: 11
        }
    });
    ws.cell(7, 20, 8, 23, true).string('FREIGHT').style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        font: {
            name: 'Arial',
            size: 11
        }
    });
    // Info
    ws.cell(17, 1, 23, 3, true).string([{
        name: 'Arial',
        bold: true,
        size: 10
    }, 'From']).style(bordeado);
    ws.cell(24, 1, 32, 3, true).string([{
        name: 'Arial',
        size: 7.5
    }, 'CONSIGNEE AND DESTINATION']).style(bordeado);
    // Destinatario y Origen
    ws.cell(17, 4, 23, 11, true).string([{
        bold: true,
        size: 11,
        name: 'Arial',
    }, 'Quality & Manufacturing Consulting S.C\n',
    {
        bold: false,
        size: 11,
        name: 'Arial'
    }, 'Circuito Aguascalientes Sur 115-E \n Parque Industrial del Valle de Aguascalientes\nC.P. 20355\n Aguascalientes, Ags.\nRFC: Q&M0102157F1'
    ]).style(bordeadoJustificado);

    ws.cell(17, 12, 17, 17, true).string([{ size: 7.5 }, 'DATE']).style(bordeado);
    ws.cell(18, 12, 23, 17, true).string([{ size: 12, name: 'Arial' }, `${mes},${fecha.getDate()},${fecha.getFullYear()}`]).style(bordeado);
    ws.cell(17, 18, 17, 23, true).string([{ size: 7.5 }, 'SHIPPER´S NUMBER']).style(bordeado);
    ws.cell(18, 18, 23, 23, true).string([{ size: 12, name: 'Arial' }, `N${fecha.getFullYear().toString().substr(2, 2)}${dia}`]).style(bordeado);


    ws.cell(24, 4, 32, 11, true).string([{
        bold: true,
        size: 11,
        name: 'Arial',
    }, `${info.cliente[1].nombre}\n`,
    {
        bold: false,
        size: 11,
        name: 'Arial'
    }, `${info.cliente[1].direccion}\nRFC:${info.cliente[1].RFC}`
    ]).style(bordeadoJustificado);
    ws.cell(24, 12, 24, 23, true).string([{
        size: 7.5
    }, 'BY']).style(AllBorder);

    ws.cell(25, 12, 26, 23, true).string(info.cliente[1].rsocial).style(AllBorder);

    ws.cell(27, 12, 27, 17, true).string([{
        size: 7.5
    }, 'ROUTE']).style(AllBorder);
    ws.cell(27, 18, 27, 23, true).string([{
        size: 7.5
    }, 'DELIVERING CARRIER']).style(AllBorder);

    ws.cell(28, 12, 29, 17, true).string('Info').style(AllBorder);
    ws.cell(28, 18, 29, 23, true).string('Info').style(AllBorder);

    ws.cell(30, 12, 30, 23, true).string([{
        size: 7.5
    }, 'CAR OR VEHICLE']).style(AllBorder);


    ws.cell(31, 12, 32, 23, true).string([{
        size: 6, name: 'Arial'
    }, 'INITIALS & NO.']).style(AllBorder);
    // Columnas
    ws.cell(33, 1, 34, 2, true).string([{
        size: 6, name: 'Arial'
    }, 'NO.PACKAGE']).style(AllBorder);
    ws.cell(33, 3, 34, 4, true).string([{
        size: 6, name: 'Arial'
    }, 'HM']).style(AllBorder);
    ws.cell(33, 5, 34, 12, true).string([{
        size: 6, name: 'Arial'
    }, 'DESCRIPTION OF ARTICLES, SPECIAL MARKS AND EXCEPTIONS']).style(AllBorder);

    ws.cell(33, 13, 34, 15, true).string([{
        size: 6, name: 'Arial'
    }, 'WEIGHT (SUBJECT TO CORR.)']).style(AllBorder);

    ws.cell(33, 16, 34, 19, true).string([{
        size: 6, name: 'Arial'
    }, 'CLASS OR RATE']).style(AllBorder);
    ws.cell(33, 20, 35, 23, true).string([{
        size: 5, name: 'Arial'
    }, '"Subject To Section 7 of conditions of Applicable bill of lading, if this shipment Is to be delivered to the consignee with-Out recourse on the consignor, the consignor shall sign he following statement. \n The carrier shall not make delivery of this delivery without payment of freight and all other lawful charges."']).style({
        alignment: {
            horizontal: 'justify',
            vertical: 'center'
        }
    }).style(AllBorder);
    ws.cell(36, 20, 41, 23, true).string([{
        size: 11, name: 'Arial', bold: true
    }, 'TO BE PREPAID']).style({
        alignment: {
            horizontal: 'justify',
            vertical: 'center'
        }, border: {
            right: {
                style: 'thin',
                color: '#000000'
            }
        }
    });


    ws.cell(42, 20, 47, 23, true).style({
        border: {
            top: {
                style: 'double',
                color: '#000000'
            },
            bottom: {
                style: 'double',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            }
        }
    });


    let estiloLista = {
        font: {
            name: 'Arial',
            size: 14
        },
        alignment: {
            wrapText: true,
            horizontal: 'left'
        },
        border: {
            left: {
                style: 'medium',
                color: '#000000'
            },
            right: {
                style: 'medium',
                color: '#000000'
            },
            top: {
                style: 'medium',
                color: '#000000'
            },
            bottom: {
                style: 'medium',
                color: '#000000'
            }
        }
    }
    let inicio = 35;
    let peso_total = 0;
    if (info.cliente[0].id_cliente == 5) {
        ws.cell(24, 4, 32, 11, true).string([{
            bold: true,
            size: 11,
            name: 'Arial',
        }, `T-NET INTERNATIONAL (EU) GMBH\n`,
        {
            bold: false,
            size: 11,
            name: 'Arial'
        }, `Blvd. Pase de los Chicahuales\nCorral de Barrancos\nJesús María, Aguascalientes C.P.20900`, { bold: true }, `\nRFC:${info.cliente[1].RFC}`
        ]).style(bordeadoJustificado);
        for (i in info.partes) {
            let parte = info.partes[i];
            ws.cell(inicio, 1, inicio + 2, 2, true).string(`1 Plt`).style(estiloLista);
            ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
            ws.cell(inicio, 5, inicio + 2, 12, true).string(`${parte.descripcion}-${parte.no_parte}\n1 Pallet@${parte.peso}`).style(estiloLista);
            ws.cell(inicio, 13, inicio + 2, 15, true).style(estiloLista);
            ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
            inicio += 3;
            peso_total += parseInt(parte.peso);
        }
    } else {
        for (i in info.partes) {
            let parte = info.partes[i];
            let cant_caja = parte.cant_x_caja;
            let cant_pallet = parte.cant_x_pallet;
            let cant = parte.cant;
            let tot_cajas = Math.floor(cant / cant_caja);
            let tot_pallets = Math.floor(tot_cajas / cant_pallet);
            let tot_peso = (parte.peso * cant) / 1000;
            ws.cell(inicio, 1, inicio + 2, 2, true).string(`${tot_pallets} Plt`).style(estiloLista);
            ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
            ws.cell(inicio, 5, inicio + 2, 12, true).string(`${parte.no_parte_ext}-${parte.descripcion}\n${tot_cajas}@${cant_caja}`).style(estiloLista);
            ws.cell(inicio, 13, inicio + 2, 15, true).string(`${tot_peso}`).style(estiloLista);
            ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
            inicio += 3;
            peso_total += tot_peso;
        }
    }
    if (inicio - 3 <= 63) {
        while (inicio != 62) {
            ws.cell(inicio, 1, inicio + 2, 2, true).style(estiloLista);
            ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
            ws.cell(inicio, 5, inicio + 2, 12, true).style(estiloLista);
            ws.cell(inicio, 13, inicio + 2, 15, true).style(estiloLista);
            ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
            inicio += 3;
            if (inicio == 59) {
                ws.cell(inicio, 5, inicio + 2, 12, true).string([{ size: 18, bold: true }, `Total: ${peso_total}`]).style(estiloLista);
            }
        }
    }
    ws.cell(inicio, 1, inicio + 2, 2, true).style(estiloLista);
    ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
    ws.cell(inicio, 5, inicio + 2, 12, true).string([{ bold: true, size: 18 }, `Sello: ${info.candado}`]).style(estiloLista);
    ws.cell(inicio, 13, inicio + 2, 15, true).style(estiloLista);
    ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
    inicio += 3;
    ws.cell(48, 20, 53, 23, true).string([{ size: 6, name: 'Arial' }, '$']).style({
        alignment: {
            horizontal: 'left',
            vertical: 'bottom',
            wrapText: true,
        },
        border: {
            bottom: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(inicio, 1, inicio + 1, 12, true).string([{ name: 'Arial', size: 6, color: '#00ccff', bold: true }, `When transporting hazardous material include the technical or chemical name for n.o.s. (not otherwise specified or generic description of material with Appropriate UN or NA number as defined in US DOT Emergency Response Standard (HM-126C). Provide emergency response phone number in case of Incident or accident.  (In box at right)`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'top'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(inicio, 13, inicio + 1, 19, true).string([{ name: 'Arial', size: 6, color: '#00ccff', bold: true }, `Emergency Response Phone Number`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'top'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    inicio += 2;
    ws.cell(inicio, 1, inicio + 1, 12, true).string([{ name: 'Arial', size: 6, color: '#000000', bold: true }, `SHIPPERS CERTIFICATION:  This is to certify that the above-named materials are properly Classified, described, packaged, marked and labeled, and are in proper condition for Transportation according to the applicable regulations of the Department of Transportation.`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(inicio, 13, inicio + 1, 19, true).string([{ name: 'Arial', size: 6, color: '#000000', bold: false }, `_________________________ TITLE: MANAGER`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'bottom'
        },
        border: {
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    inicio += 2;
    ws.cell(inicio, 1, inicio + 2, 19, true).string([{ name: 'Arial', size: 6, color: '#000000', bold: true }, `*If the shipment moves between two ports by a carrier by water, the law requires that the bill of lading shall state whether it is “Carrier’s or Shippers Weight”.\n`, { name: 'Arial', size: 4, color: '#000000', bold: true }, `*Shipper’s Imprints in lieu of stamp; not a part of Bill of Lading approved by the Interstate Commerce Commission.\n`, { name: 'Arial', size: 6, color: '#000000', bold: true }, `Note – Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or declared value of the property\n`, { name: 'Arial', size: 6, color: '#000000', bold: true }, `The agreed or declared value of the property is hereby specifically stated by the shipper to be not exceeding    ________________________________`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'justify'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });

    inicio += 3;
    ws.cell(inicio, 1, inicio + 2, 7, true).string([{ size: 6, bold: true, name: 'Arial' }, `THIS SHIPMENT IS CORRECTLY DESCRIBED.\n\nCORRECT WEIGHT IS _______________KGS.`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });

    ws.cell(inicio, 8, inicio + 2, 10, true).string([{ size: 6, bold: true, name: 'Arial' }, `*The fiber boxes used for this shipment conforms to the specifications set forth in the box makers certificate thereon, and all other requirements of the Consolidated Freight Classification.`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'justify'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(inicio + 2, 11, inicio + 2, 19, true).string([{ size: 6, bold: false, name: 'Arial' }, `PER                                       SHIPPER`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'justify'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell()
    inicio += 3;
    ws.cell(inicio, 1, inicio + 1, 23, true).string([{ size: 7.5, bold: true, name: 'Arial' }, `QUALITY & MANUFACTURING CONSULTING S.C.\n`, { size: 6, bold: false, name: 'Arial' }, `Parque Industrial del Valle de Aguascalientes, C.P.  20355, Circuito Aguascalientes Sur 115-E\n`, { size: 6, bold: false, name: 'Arial' }, `Aguascalientes, Ags, Mexico  20355      RFC:  Q&M0102157F1      Phone:  (449) 9168032`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'justify',
            vertical: 'top'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(54, 20, 64, 23, true).style(AllBorder);
    ws.cell(65, 20, 74, 23, true).string([{ color: '#ff0000', size: 7.5, name: 'Arial' }, 'C.O.D SHIPMENT\n\n\nC.O.D AMT_______\n\n\nCollection Free______\n\n\nTotal Charges______']).style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    wb.write(path.join(__dirname, `../docs/Bill Of Landing ${info.cliente[1].nombre} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}.xlsx`), function (err) {
        if (err) res.send({ message: 'Ocurrió un Error', status: 500 });
        else {
            res.send({ message: 'Archivo creado', status: 200 });
        }
    });
});

api.post('/OrderSheet', md_nivel.ensureLevel2, function (req, res) {
    let info = req.body;
    let usuario = req.headers.authorization;
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fecha = new Date(`${info.fecha.split('\/')[2]}`, `${info.fecha.split('\/')[1] - 1}`, `${info.fecha.split('\/')[0]}`)
    fecha.toLocaleDateString('es-MX', options);
    let meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let mes = meses[fecha.getMonth()];
    let comienzo = new Date(fecha.getFullYear(), 0, 0);
    let dif = fecha - comienzo;
    let unDia = 1000 * 60 * 60 * 24;
    let dia = Math.ceil(dif / unDia) - 1;
    let wb = new xl.Workbook();
    //Estilos
    let styleLista = {
        font: {
            name: 'Arial',
            size: 11
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let styleEncanbezados = {
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }, font: {
            name: 'Verdana',
            size: 6.5
        }, border: {

        }, border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let styleDetalle = {
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }, font: {
            name: 'Verdana'
        }, border: {

        }, border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let bordeadoNegritas = {
        font: {
            bold: true,
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let bordeado = {
        font: {
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }

    let bordeadoJustificado = {
        font: {
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'justify',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }

    // Encabezado
    let ws = wb.addWorksheet('Sheet 1', {
        pageSetup: {
            paperSize: 'LETTER_PAPER',
            usePrinterDefaults: true,
            fitToWidth: 1
        },
        sheetView: {
            showGridLines: false
        },
        margins: {
            bottom: 0,
            top: 0
        },
        headerFooter: {
            scaleWithDoc: true
        }
    });

    ws.column(1).setWidth(6.57);
    ws.column(2).setWidth(5.14);
    ws.column(3).setWidth(1.14);
    ws.column(4).setWidth(1.14);
    ws.column(5).setWidth(4.86);
    ws.column(6).setWidth(4.86);
    ws.column(7).setWidth(10.71);
    ws.column(8).setWidth(10.71);
    ws.column(9).setWidth(10.71);
    ws.column(10).setWidth(11.43);
    ws.column(11).setWidth(0.67);
    ws.column(12).setWidth(2.43);
    ws.column(13).setWidth(2.43);
    ws.column(14).setWidth(6.57);
    ws.column(15).setWidth(6.57);
    ws.column(16).setWidth(5);
    ws.column(17).setWidth(4.87);
    ws.column(18).setWidth(9);
    ws.column(19).setWidth(2.43);
    ws.column(20).setWidth(4);
    ws.column(21).setWidth(8.71);
    ws.column(22).setWidth(6.29);
    ws.column(23).setWidth(1);
    ws.column(24).setWidth(1);

    ws.cell(1, 1, 4, 6, true).style(bordeado);
    ws.cell(1, 19, 1, 23, true).string('Clasificación:B').style(bordeadoNegritas);
    ws.cell(1, 7, 4, 18, true).string('LG.02.01.C\nORDER SHEET').style(bordeadoNegritas);
    ws.cell(2, 19, 2, 23, true).string('Adecuación 1').style(bordeado);
    ws.cell(3, 19, 3, 23, true).string('Revisión 1').style(bordeado);
    ws.cell(4, 19, 4, 23, true).string('Página 1 de 1').style(bordeado);

    //Logo QMC
    ws.addImage({
        path: path.join(__dirname, '../client/production/images/QMC_LOGO2.png'),
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: 2,
                colOff: 0,
                row: 1,
                rowOff: '0.05in'
            },
            to: {
                col: 4,
                colOff: '1in',
                row: 6,
                rowOff: 0
            }
        }
    });

    //ORDER SHEET
    ws.cell(5, 1, 6, 16, true).string('ORDER SHEET').style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }, font: {
            size: 16,
            bold: true,
            underline: true,
            name: 'Bookman Old Style'
        }
    });
    ws.cell(5, 17, 5, 18, true).string('Page').style({
        alignment: {
            wrapText: true,
            horizontal: 'left'
        }, font: {
            size: 7.5,
            name: 'Verdana'
        }
    });
    ws.cell(5, 19, 5, 20, true).string('1').style({
        alignment: {
            wrapText: true,
            horizontal: 'left'
        }, font: {
            size: 11,
            name: 'Verdana'
        }
    });

    // Info
    ws.cell(7, 1, 13, 3, true).string([{
        name: 'Arial',
        bold: true,
        size: 10
    }, 'SHIP TO:']).style(bordeado);


    ws.cell(14, 1, 20, 3, true).string([{
        name: 'Arial',
        size: 7.5
    }, 'CUSTOMER:']).style(bordeado);


    // Destinatario y Origen
    ws.cell(7, 4, 13, 14, true).string([{
        bold: true,
        size: 11,
        name: 'Arial',
    }, info.cliente[1].nombre + "\n",
    {
        bold: false,
        size: 11,
        name: 'Arial'
    }, info.cliente[1].direccion
    ]).style(bordeadoJustificado);

    ws.cell(14, 4, 20, 14, true).string([{
        bold: true,
        size: 11,
        name: 'Arial',
    }, info.cliente[0].nombre + "\n",
    {
        bold: false,
        size: 11,
        name: 'Arial'
    }, info.cliente[0].direccion, { bold: true }, `\nRFC:${info.cliente[0].RFC}`
    ]).style(bordeadoJustificado);

    //Detalles
    ws.cell(7, 16, 7, 18, true).string([{ size: 7.5 }, "ORDER REF#"]).style(styleDetalle);
    ws.cell(7, 19, 7, 23, true).string([{ size: 11, bold: true }, `N${fecha.getFullYear().toString().substr(2, 2)}${dia}`]).style(styleDetalle);

    ws.cell(8, 16, 8, 18, true).string([{ size: 7.5 }, "D/O REF#"]).style(styleDetalle);
    ws.cell(8, 19, 8, 23, true).string([{ size: 11 }, `Week ${info.semana}`]).style(styleDetalle);

    ws.cell(9, 16, 9, 18, true).string([{ size: 7.5 }, "DEL/VERY DATE"]).style(styleDetalle);
    ws.cell(9, 19, 9, 23, true).string([{ size: 11 }, info.fecha]).style(styleDetalle);

    ws.cell(10, 16, 10, 18, true).string([{ size: 7.5 }, "DELIVERY TIME"]).style(styleDetalle);
    ws.cell(10, 19, 10, 23, true).string([{ size: 11 }, "9:00"]).style(styleDetalle);

    ws.cell(11, 16, 11, 18, true).string([{ size: 7.5 }, "BATCH PREPARED"]).style(styleDetalle);
    ws.cell(11, 19, 11, 23, true).string([{ size: 11 }, usuario.nombre]).style(styleDetalle);

    ws.cell(12, 16, 12, 18, true).string([{ size: 7.5 }, "BATCH RELEASER"]).style(styleDetalle);
    ws.cell(12, 19, 12, 23, true).string([{ size: 11 }, usuario.nombre]).style(styleDetalle);

    ws.cell(13, 16, 13, 18, true).string([{ size: 7.5 }, "LOT  CHARGE"]).style(styleDetalle);
    ws.cell(13, 19, 13, 23, true).string([{ size: 11 }, "Leader Logistic"]).style(styleDetalle);
    //Encabezados de Tablas
    ws.cell(22, 1, 23, 1, true).string("NO.").style(styleEncanbezados);
    ws.cell(22, 2, 23, 6, true).string("PARTS NUMBER").style(styleEncanbezados);
    ws.cell(22, 7, 23, 7, true).string("QUANTITY").style(styleEncanbezados);
    ws.cell(22, 8, 23, 8, true).string("QTY/CASE").style(styleEncanbezados);
    ws.cell(22, 9, 23, 10, true).string("CASE").style(styleEncanbezados);
    ws.cell(22, 11, 23, 14, true).string("PRICE").style(styleEncanbezados);
    ws.cell(22, 15, 23, 16, true).string("MODL YEAR").style(styleEncanbezados);
    ws.cell(22, 17, 23, 18, true).string("ORDER #").style(styleEncanbezados);
    ws.cell(22, 19, 23, 20, true).string("REF #").style(styleEncanbezados);
    ws.cell(22, 21, 23, 23, true).string("REMARKS").style(styleEncanbezados);
    let inicio = 24;
    let cajas_total = 0;
    if (info.cliente[0].id_cliente == 5) {
        for (index in info.partes) {
            let parte = info.partes[index];
            ws.cell(inicio, 1, inicio + 1, 1, true).string(`${parseInt(index) + 1}`).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 6, true).string(`${parte.no_parte}`).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 7, true).string(`${parte.peso}`).style(styleLista);
            ws.cell(inicio, 8, inicio + 1, 8, true).string(`${parte.peso}`).style(styleLista);
            ws.cell(inicio, 9, inicio + 1, 10, true).string(`1`).style(styleLista);
            ws.cell(inicio, 11, inicio + 1, 14, true).string("0.000").style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).string(`2623 ${fecha.getFullYear().toString().substr(2, 2)}${dia}`).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 20, true).style(styleLista);
            ws.cell(inicio, 21, inicio + 1, 23, true).string(`1.00`).style(styleLista);
            inicio += 2;
            cajas_total += 1;
        }
    } else {
        for (index in info.partes) {
            let parte = info.partes[index];
            let cant_caja = parte.cant_x_caja;
            let cant_pallet = parte.cant_x_pallet;
            let cant = parte.cant;
            let tot_cajas = Math.floor(cant / cant_caja);
            let tot_pallets = Math.floor(tot_cajas / cant_pallet);
            let precio = parte.precio * cant;
            ws.cell(inicio, 1, inicio + 1, 1, true).string(`${parseInt(index) + 1}`).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 6, true).string(`${parte.no_parte_ext}`).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 7, true).string(`${tot_cajas}`).style(styleLista);
            ws.cell(inicio, 8, inicio + 1, 8, true).string(`${cant_caja}`).style(styleLista);
            ws.cell(inicio, 9, inicio + 1, 10, true).string(`${cant}`).style(styleLista);
            ws.cell(inicio, 11, inicio + 1, 14, true).string(`${precio}`).style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).string(`2623 ${fecha.getFullYear().toString().substr(2, 2)}${dia}`).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 20, true).style(styleLista);
            ws.cell(inicio, 21, inicio + 1, 23, true).string(`${tot_pallets}`).style(styleLista);
            inicio += 2;
            cajas_total += tot_cajas;
        }
    }
    if (inicio < 64) {
        while (inicio != 64) {
            ws.cell(inicio, 1, inicio + 1, 1, true).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 6, true).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 7, true).style(styleLista);
            ws.cell(inicio, 8, inicio + 1, 8, true).style(styleLista);
            ws.cell(inicio, 9, inicio + 1, 10, true).style(styleLista);
            ws.cell(inicio, 11, inicio + 1, 14, true).style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 20, true).style(styleLista);
            ws.cell(inicio, 21, inicio + 1, 23, true).style(styleLista);
            inicio += 2;
            if (inicio == 56) {
                ws.cell(inicio, 9, inicio + 1, 10, true).string([{ size: 14, bold: true }, 'Total Boxes:']).style(styleLista);
                ws.cell(inicio, 11, inicio + 1, 14, true).string([{ size: 14, bold: true }, `${cajas_total}`]).style(styleLista);
            }
            if (inicio == 58) {
                ws.cell(inicio, 9, inicio + 1, 10, true).string([{ size: 14, bold: true }, 'Pallet Extra:']).style(styleLista);
                ws.cell(inicio, 11, inicio + 1, 14, true).string([{ size: 14, bold: true }, `1`]).style(styleLista);
            }
        }
    }
    ws.cell(64, 1, 68, 11, true).string([{ sise: 9 }, `AME Form NLV 11  dated: Nov 21,  2011\n                          `, { size: 10 }, `Seal Number:${info.candado}`]).style({
        border: {
            top: {
                style: 'thin',
                color: '#000000'
            }
        },
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'top'
        }
    });
    ws.cell(64, 12, 68, 23, true).string([{ bold: true, size: 11 }, "Quality & Manufacturing Consulting S.C.\n", { bold: false }, "Circuito Aguascalientes Sur 115-E\nParque Industrial del Valle de Aguascalientes", { bold: true }, "C.P.", { bold: false }, "20355\nAguascalientes, Ags.", { bold: true }, "\nRFC: Q&M0102157F1"]).style({
        border: {
            top: {
                style: 'thin',
                color: '#000000'
            }
        },
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'top'
        }
    });


    //Escribir Documento

    wb.write(path.join(__dirname, `../docs/Order Sheet ${info.cliente[1].nombre} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}.xlsx`), function (err) {
        if (err) res.send({ message: 'Ocurrió un Error', status: 500 });
        else {
            res.send({ message: 'Archivo creado', status: 200 });
        }
    });



});

api.post('/PackingList', md_nivel.ensureLevel2, function (req, res) {
    let info = req.body;
    let usuario = req.headers.authorization;
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fecha = new Date(`${info.fecha.split('\/')[2]}`, `${info.fecha.split('\/')[1] - 1}`, `${info.fecha.split('\/')[0]}`)
    fecha.toLocaleDateString('es-MX', options);
    let meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let mes = meses[fecha.getMonth()];
    let comienzo = new Date(fecha.getFullYear(), 0, 0);
    let dif = fecha - comienzo;
    let unDia = 1000 * 60 * 60 * 24;
    let dia = Math.ceil(dif / unDia) - 1;
    let wb = new xl.Workbook();
    //Estilos
    let styleLista = {
        font: {
            name: 'Arial',
            size: 11
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let styleEncanbezados = {
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }, font: {
            name: 'Verdana',
            size: 6.5
        }, border: {

        }, border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }

    let bordeadoNegritas = {
        font: {
            bold: true,
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let bordeado = {
        font: {
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    // Encabezado
    let ws = wb.addWorksheet('Sheet 1', {
        pageSetup: {
            paperSize: 'LETTER_PAPER',
            usePrinterDefaults: true,
            fitToWidth: 1
        },
        sheetView: {
            showGridLines: false
        },
        margins: {
            bottom: 0,
            top: 0
        },
        headerFooter: {
            scaleWithDoc: true
        }
    });

    //Set Column Width
    ws.column(1).setWidth(6);
    ws.column(2).setWidth(6);
    ws.column(3).setWidth(6);
    ws.column(4).setWidth(6);
    ws.column(5).setWidth(6);
    ws.column(6).setWidth(6);
    ws.column(7).setWidth(6);
    ws.column(8).setWidth(6);
    ws.column(9).setWidth(6);
    ws.column(10).setWidth(6);
    ws.column(11).setWidth(6);
    ws.column(12).setWidth(6);
    ws.column(13).setWidth(6);
    ws.column(14).setWidth(6);
    ws.column(15).setWidth(6);
    ws.column(16).setWidth(6);
    ws.column(17).setWidth(6);
    ws.column(18).setWidth(6);
    ws.column(19).setWidth(6);
    ws.column(20).setWidth(6);
    ws.column(21).setWidth(6);
    ws.column(22).setWidth(6);
    ws.column(23).setWidth(6);
    ws.column(24).setWidth(6);
    ws.column(25).setWidth(6);
    ws.column(26).setWidth(6);

    ws.cell(1, 1, 4, 4, true).style(bordeado);
    ws.cell(1, 5, 4, 17, true).string('LG.02.01.D\nPACKING LIST').style(bordeadoNegritas);
    ws.cell(1, 18, 1, 21, true).string('Clasificación:B').style(bordeadoNegritas);
    ws.cell(2, 18, 2, 21, true).string('Adecuación 1').style(bordeado);
    ws.cell(3, 18, 3, 21, true).string('Revisión 1').style(bordeado);
    ws.cell(4, 18, 4, 21, true).string('Página 1 de 1').style(bordeado);

    ws.addImage({
        path: path.join(__dirname, '../client/production/images/QMC_LOGO2.png'),
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: 1,
                colOff: '0.45in',
                row: 1,
                rowOff: '0.05in'
            },
            to: {
                col: 4,
                colOff: '1in',
                row: 4,
                rowOff: 0
            }
        }
    });

    ws.cell(5, 4, 8, 21, true).string([{ bold: true, size: 11 }, "Quality & Manufacturing Consulting S.C.\n", { bold: false }, "Circuito Aguascalientes Sur 115-E\nParque Industrial del Valle de Aguascalientes", { bold: true }, "\nC.P.", { bold: false }, "20355\nAguascalientes, Ags.", { bold: true }, "\nRFC: Q&M0102157F1"]).style({
        border: {
            top: {
                style: 'thin',
                color: '#000000'
            }
        },
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'top'
        }
    });

    ws.cell(9, 5, 10, 17, true).string([{ size: 16, bold: true, underline: true, name: 'Bookman Old Style' }, "PACKING LIST"]).style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }
    });

    //Clientes
    ws.cell(11, 1, 15, 2, true).string('SHIP TO').style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });
    ws.cell(16, 1, 20, 2, true).string('SUPPLIER').style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });
    ws.cell(11, 3, 15, 13, true).string([{ bold: true, name: 'Calibri' }, info.cliente[1].nombre + "\n", { bold: false, name: 'Calibri' }, info.cliente[1].direccion + "\n", { bold: true, name: 'Calibri' }, `RFC: ${info.cliente[1].RFC}`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'center'
        }
    });

    ws.cell(16, 3, 20, 13, true).string([{ bold: true, name: 'Calibri' }, info.cliente[0].nombre + "\n", { bold: false, name: 'Calibri' }, info.cliente[0].direccion + "\n", { bold: true, name: 'Calibri' }]).style({
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'center'
        }
    });
    //Información general
    ws.cell(11, 15, 11, 17, true).string([{ size: 12 }, "DUNS NO"]).style(bordeado);
    ws.cell(11, 18, 11, 21, true).string([{ size: 12, bold: true }, `N${fecha.getFullYear().toString().substr(2, 2)}${dia}`]).style(bordeado);

    ws.cell(12, 15, 12, 17, true).string([{ size: 12 }, "SHIP DATE"]).style(bordeado);
    ws.cell(12, 18, 12, 21, true).string([{ size: 12 }, `${mes} ${fecha.getDate()},${fecha.getFullYear()}`]).style(bordeado);

    ws.cell(13, 15, 13, 17, true).string([{ size: 12 }, "BATCH RELEASER"]).style(bordeado);
    ws.cell(13, 18, 13, 21, true).string([{ size: 12 }, usuario.nombre]).style(bordeado);

    ws.cell(15, 15, 15, 17, true).string([{ size: 12 }, "B/L NO."]).style(bordeado);
    ws.cell(15, 18, 15, 21, true).string([{ size: 12, bold: true }, `N${fecha.getFullYear().toString().substr(2, 2)}${dia}`]).style(bordeado);

    ws.cell(22, 1, 23, 1, true).string("NO.").style(styleEncanbezados);
    ws.cell(22, 2, 23, 6, true).string("PART NUMBER").style(styleEncanbezados);
    ws.cell(22, 7, 23, 12, true).string("DESCRIPTION").style(styleEncanbezados);
    ws.cell(22, 13, 23, 14, true).string("CASE").style(styleEncanbezados);
    ws.cell(22, 15, 23, 16, true).string("QTY/CASE").style(styleEncanbezados);
    ws.cell(22, 17, 23, 18, true).string("QUANTTITY").style(styleEncanbezados);
    ws.cell(22, 19, 23, 21, true).string("REMARKS").style(styleEncanbezados);

    let inicio = 24;
    let tot_peso = 0;
    let pallets_tot = 0;
    if (info.cliente[0].id_cliente == 5) {
        ws.cell(16, 18, 16, 21, true).string([{ size: 7.5 }, `P. HERMANN`]).style(bordeado);
        for (index in info.partes) {
            let parte = info.partes[index];
            let cant_caja = parte.cant_x_caja;
            let cant_pallet = parte.cant_x_pallet;
            let cant = parte.cant;
            let tot_cajas = Math.floor(cant / cant_caja);
            let tot_pallets = Math.floor(tot_cajas / cant_pallet);
            ws.cell(inicio, 1, inicio + 1, 1, true).string(`${parseInt(index) + 1}`).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 6, true).string(parte.no_parte).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 12, true).string(parte.descripcion).style(styleLista);
            ws.cell(inicio, 13, inicio + 1, 14, true).string(`1`).style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).string(`${parte.peso}`).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).string(`${parte.peso}`).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 21, true).string(`2623 ${fecha.getFullYear().toString().substr(2, 2)}${dia}`).style(styleLista);
            tot_peso += parseInt(parte.peso);
            pallets_tot += 1;
            inicio += 2;

        }
    } else {
        for (index in info.partes) {
            let parte = info.partes[index];
            let cant_caja = parte.cant_x_caja;
            let cant_pallet = parte.cant_x_pallet;
            let cant = parte.cant;
            let tot_cajas = Math.floor(cant / cant_caja);
            let tot_pallets = Math.floor(tot_cajas / cant_pallet);
            ws.cell(inicio, 1, inicio + 1, 1, true).string(`${parseInt(index) + 1}`).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 6, true).string(parte.no_parte_ext).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 12, true).string(parte.descripcion).style(styleLista);
            ws.cell(inicio, 13, inicio + 1, 14, true).string(`${cant_caja}`).style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).string(`${tot_cajas}`).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).string(parte.cant).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 21, true).string(`1`).style(styleLista);
            tot_peso += parte.peso * cant;
            pallets_tot += tot_pallets;
            inicio += 2;
            ws.cell(16, 18, 16, 21, true).string([{ size: 7.5 }, info.cliente[1].rsocial]).style(bordeado);
        }
    }


    if (inicio < 64) {
        while (inicio < 64) {
            ws.cell(inicio, 1, inicio + 1, 1, true).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 6, true).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 12, true).style(styleLista);
            ws.cell(inicio, 13, inicio + 1, 14, true).style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 21, true).style(styleLista);
            if (inicio == 48) {
                ws.cell(inicio, 17, inicio + 1, 19, true).string([{ bold: true }, info.candado]).style(styleLista);
            }
            inicio += 2;
        }
    }

    ws.cell(16, 15, 16, 17, true).string([{ size: 7.5 }, "CARRIER"]).style(bordeado);


    ws.cell(17, 15, 17, 17, true).string([{ size: 7.5 }, "TOTAL PALLET"]).style(bordeado);
    ws.cell(17, 18, 17, 21, true).string([{ size: 7.5 }, `${pallets_tot}`]).style(bordeado);

    ws.cell(18, 15, 18, 17, true).string([{ size: 7.5 }, "TOTAL WEIGHT (Kg)"]).style(bordeado);
    ws.cell(18, 18, 18, 21, true).string([{ size: 7.5 }, `${tot_peso}`]).style(bordeado);

    ws.cell(64, 1, 64, 21, true).string([{ name: 'Verdana', size: 11 }, "QMC Form NLV 12  dated: Oct 21, 2010"]).style({
        border: {
            top: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(66, 3, 66, 15, true).string([{ name: 'Verdana', size: 11 }, "RECEIVED BY______________________________   on ___________________"]);
    ws.cell(67, 5, 67, 6, true).string([{ name: 'Verdana', size: 7 }, "Signature"]);
    ws.cell(66, 17, 66, 21, true).style({
        border: {
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(67, 17, 67, 21, true).string([{ name: 'Verdana', size: 9 }, "Release"]).style({
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        }
    });

    ws.cell(71, 3, 71, 8, true).style({
        border: {
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(71, 11, 71, 15, true).style({
        border: {
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(72, 11, 72, 12, true).string([{ name: 'Verdana', size: 9 }, "Printed Name"]);
    ws.cell(72, 17, 72, 19, true).string([{ name: 'Verdana', size: 9 }, "Trucking Company"]);

    wb.write(path.join(__dirname, `../docs/Packing List ${info.cliente[1].nombre} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}.xlsx`), function (err) {
        if (err) res.send({ message: 'Ocurrió un Error', status: 500 });
        else {
            res.send({ message: 'Archivo creado', status: 200 });
        }
    });
});

//Recibos
api.post('/Receiving', md_nivel.ensureLevel2, function (req, res) {
    let info = req.body;
    let usuario = req.headers.authorization;
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fecha = new Date(`${info.fecha.split('\/')[2]}`, `${info.fecha.split('\/')[1] - 1}`, `${info.fecha.split('\/')[0]}`)
    fecha.toLocaleDateString('es-MX', options);
    let meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let mes = meses[fecha.getMonth()];
    let comienzo = new Date(fecha.getFullYear(), 0, 0);
    let dif = fecha - comienzo;
    let unDia = 1000 * 60 * 60 * 24;
    let dia = Math.ceil(dif / unDia) - 1;
    let wb = new xl.Workbook();
    //Estilos
    let styleLista = {
        font: {
            name: 'Arial',
            size: 11
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            }
        }
    }
    let styleEncanbezados = {
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        }, font: {
            name: 'Verdana',
            size: 6.5
        }, border: {

        }, border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }

    let bordeado = {
        font: {
            name: 'Arial'
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    }


    // Encabezado
    let ws = wb.addWorksheet('Sheet 1', {
        pageSetup: {
            paperSize: 'LETTER_PAPER',
            usePrinterDefaults: true,
            fitToWidth: 1
        },
        sheetView: {
            showGridLines: false
        },
        margins: {
            bottom: 0,
            top: 0
        },
        headerFooter: {
            scaleWithDoc: true
        }
    });
    //Set Column Width
    ws.column(1).setWidth(6);
    ws.column(2).setWidth(6);
    ws.column(3).setWidth(6);
    ws.column(4).setWidth(6);
    ws.column(5).setWidth(6);
    ws.column(6).setWidth(6);
    ws.column(7).setWidth(6);
    ws.column(8).setWidth(6);
    ws.column(9).setWidth(6);
    ws.column(10).setWidth(6);
    ws.column(11).setWidth(6);
    ws.column(12).setWidth(6);
    ws.column(13).setWidth(6);
    ws.column(14).setWidth(6);
    ws.column(15).setWidth(6);
    ws.column(16).setWidth(6);
    ws.column(17).setWidth(6);
    ws.column(18).setWidth(6);
    ws.column(19).setWidth(6);
    ws.column(20).setWidth(6);
    ws.column(21).setWidth(6);
    ws.column(22).setWidth(6);
    ws.column(23).setWidth(6);
    ws.column(24).setWidth(6);
    ws.column(25).setWidth(6);
    ws.column(26).setWidth(6);
    //Encabezado
    ws.addImage({
        path: path.join(__dirname, '../client/production/images/QMC_LOGO2.png'),
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: 1,
                colOff: '0.45in',
                row: 1,
                rowOff: '0.05in'
            },
            to: {
                col: 4,
                colOff: '1in',
                row: 4,
                rowOff: 0
            }
        }
    });
    ws.cell(2, 6, 3, 15, true).string([{ size: 16, bold: true, underline: true, name: 'Bookman Old Style' }, "RECEIVING FORM"]).style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });

    ws.cell(2, 17, 2, 18, true).string([{ size: 7.5 }, 'PAGE:']).style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });

    ws.cell(3, 17, 3, 18, true).string([{ size: 7.5 }, 'DATE:']).style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });

    ws.cell(2, 19, 2, 21, true).string([{ size: 7.5 }, '1']).style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });

    ws.cell(3, 19, 3, 21, true).string([{ size: 7.5 }, 'FECHA']).style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });
    //Fin encabezado
    //Clientes
    ws.cell(6, 1, 10, 2, true).string('RECEIVED BY:').style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });
    ws.cell(11, 1, 15, 2, true).string('SUPPLIER').style({
        wrapText: true,
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    });
    ws.cell(6, 3, 10, 11, true).string([{ bold: true, size: 10 }, "Quality & Manufacturing Consulting S.C.\n", { bold: false }, "Circuito Aguascalientes Sur 115-E\nParque Industrial del Valle de Aguascalientes", { bold: true }, "\nC.P.", { bold: false }, "20355\nAguascalientes, Ags.", { bold: true }, "\nRFC: Q&M0102157F1"]).style({
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'center'
        }
    });
    ws.cell(11, 3, 15, 11, true).string([{ bold: true, name: 'Calibri' }, info.cliente.nombre + "\n", { bold: false, name: 'Calibri' }, info.cliente.direccion + "\n", { bold: true, name: 'Calibri' }]).style({
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'center'
        }
    })
    //Fin clientes
    //Metadatos
    ws.cell(6, 14, 6, 15, true).string('ORDER REF#').style(styleEncanbezados);
    ws.cell(7, 14, 7, 15, true).string('D/O REF#').style(styleEncanbezados);
    ws.cell(8, 14, 8, 15, true).string('RECEIVING DATE').style(styleEncanbezados);
    ws.cell(9, 14, 9, 15, true).string('RECEIVING TIME').style(styleEncanbezados);
    ws.cell(10, 14, 10, 15, true).string('RECEIVE').style(styleEncanbezados);
    ws.cell(11, 14, 11, 15, true).string('REMOVE PADLOCK').style(styleEncanbezados);
    ws.cell(12, 14, 12, 15, true).string('MACHINERY OPERATOR').style(styleEncanbezados);

    ws.cell(6, 16, 6, 21, true).string([{ bold: true }, `N${fecha.getFullYear().toString().substr(2, 2)}${dia}`]).style(bordeado);
    ws.cell(7, 16, 7, 21, true).string(`Week ${info.semana}`).style(bordeado);
    ws.cell(8, 16, 8, 21, true).string(`${mes} ${fecha.getDate()},${fecha.getFullYear()}`).style(bordeado);
    ws.cell(9, 16, 9, 21, true).string(`${tiempo.getHours()}:${tiempo.getMinutes()}`).style(bordeado);
    ws.cell(10, 16, 10, 21, true).string(usuario.nombre).style(bordeado);
    ws.cell(11, 16, 11, 21, true).string(usuario.nombre).style(bordeado);
    ws.cell(12, 16, 12, 21, true).string(info.operario).style(bordeado);
    //Fin Metadatos

    //Encabezados de Lista
    ws.cell(17, 1, 18, 1, true).string('NO.').style(styleEncanbezados);
    ws.cell(17, 2, 18, 6, true).string('PARTS NUMBER').style(styleEncanbezados);
    ws.cell(17, 7, 18, 8, true).string('QUANTIY').style(styleEncanbezados);
    ws.cell(17, 9, 18, 10, true).string('QTY/CASE').style(styleEncanbezados);
    ws.cell(17, 11, 18, 12, true).string('CASE').style(styleEncanbezados);
    ws.cell(17, 13, 18, 14, true).string('PRICE').style(styleEncanbezados);
    ws.cell(17, 15, 18, 16, true).string('MODL YEAR').style(styleEncanbezados);
    ws.cell(17, 17, 18, 18, true).string('ORDER #').style(styleEncanbezados);
    ws.cell(17, 19, 18, 19, true).string('REF#').style(styleEncanbezados);
    ws.cell(17, 20, 18, 21, true).string('REMARKS').style(styleEncanbezados);
    //Fin de Encabezados de Lista

    //Cuerpo de Llista

    let inicio = 19;
    let pallets_tot = 0;
    let cajas_tot = 0;
    for (index in info.partes) {

        let parte = info.partes[index];
        let cant_caja = parte.cant_x_caja;
        let cant_pallet = parte.cant_x_pallet || null;
        let cant = parte.cant;
        let tot_cajas = Math.floor(cant / cant_caja) || parte.cant;
        let precio = parte.cant * parte.precio;
        let tot_pallets = (cant_pallet != null) ? Math.floor(tot_cajas / cant_pallet) : parte.remarks;
        ws.cell(inicio, 1, inicio + 1, 1, true).string(`0${parseInt(index) + 1}`).style(styleLista);
        ws.cell(inicio, 2, inicio + 1, 6, true).string(`${parte.no_parte}`).style(styleLista);
        ws.cell(inicio, 7, inicio + 1, 8, true).string(`${cant}`).style(styleLista);
        ws.cell(inicio, 9, inicio + 1, 10, true).string(`${cant_caja}`).style(styleLista);
        ws.cell(inicio, 11, inicio + 1, 12, true).string(`${tot_cajas}`).style(styleLista);
        ws.cell(inicio, 13, inicio + 1, 14, true).string(`${precio}`).style(styleLista);
        ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
        ws.cell(inicio, 17, inicio + 1, 18, true).string(`2623 ${fecha.getFullYear().toString().substr(2, 2)}${dia}`).style(styleLista);
        ws.cell(inicio, 19, inicio + 1, 19, true).style(styleLista);
        ws.cell(inicio, 20, inicio + 1, 21, true).string(`${tot_pallets}`).style(styleLista);
        inicio += 2;
        pallets_tot += tot_pallets;
        cajas_tot += tot_cajas;

    }
    //Fin de Cuerpo de Lista
    //Inicio de Relleno
    if (inicio != 69) {
        while (inicio <= 69) {


            ws.cell(inicio, 1, inicio + 1, 1, true).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 6, true).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 8, true).style(styleLista);
            ws.cell(inicio, 9, inicio + 1, 10, true).style(styleLista);
            ws.cell(inicio, 11, inicio + 1, 12, true).style(styleLista);
            ws.cell(inicio, 13, inicio + 1, 14, true).style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 19, true).style(styleLista);
            ws.cell(inicio, 20, inicio + 1, 21, true).style(styleLista);

            inicio += 2;
        }
    }
    ws.cell(49, 2, 50, 6, true).string([{ size: 11 }, `Container: ${info.id_contenedor}`]).style(styleLista);
    ws.cell(51, 2, 52, 6, true).string([{ size: 11 }, `Padlock: ${info.id_candado}`]).style(styleLista);
    ws.cell(53, 2, 54, 6, true).string([{ size: 11 }, `Invoice: ${info.factura}`]).style(styleLista);
    ws.cell(55, 2, 56, 6, true).string([{ size: 11 }, `Pedimento: ${info.pedimento}`]).style(styleLista);
    if (info.cliente.id_cliente != 5) {
        ws.cell(57, 9, 58, 10, true).string([{ size: 11, bold: true, name: 'Verdana' }, `Total Pallets`]).style(styleLista);
        ws.cell(59, 9, 60, 10, true).string([{ size: 11, bold: true, name: 'Verdana' }, `Total Box`]).style(styleLista);
        ws.cell(57, 11, 58, 12, true).string([{ size: 11, bold: true, name: 'Verdana' }, `${pallets_tot}`]).style(styleLista);
        ws.cell(59, 11, 60, 12, true).string([{ size: 11, bold: true, name: 'Verdana' }, `${cajas_tot}`]).style(styleLista);
    }

    //Fin de Relleno
    //Pie de Documento

    ws.cell(71, 1, 71, 11, true).string([{ size: 9, bold: false, name: 'Verdana' }, `AME Form NLV 11  dated: May 04,  2011`]).style({
        border: {
            top: {
                style: 'thin',
                color: '#000000'
            }
        }
    });
    ws.cell(71, 12, 75, 21, true).string([{ bold: true, size: 11 }, "Quality & Manufacturing Consulting S.C.\n", { bold: false }, "Circuito Aguascalientes Sur 115-E\nParque Industrial del Valle de Aguascalientes", { bold: true }, "\nC.P.", { bold: false }, "20355\nAguascalientes, Ags.", { bold: true }, "\nRFC: Q&M0102157F1"]).style({
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'center'
        }
    }).style({
        border: {
            top: {
                style: 'thin',
                color: '#000000'
            }
        }
    });

    //Fin de Pie de Docuemtno
    wb.write(path.join(__dirname, `../docs/Receiving ${info.cliente.nombre} Week ${info.semana}.xlsx`), function (err) {
        if (err) res.send({ message: 'Ocurrió un Error', status: 500 });
        else {
            res.send({ message: 'Archivo creado', status: 200 });
        }
    });
});

api.get('/ReleaseReceiving/:proyecto/:nombre', md_nivel.ensureLevel2, async function (req, res) {
    let info = null;
    info = await new Promise(function (resolve, reject) {
        con.query(`select week(ma.fecha)                                                    semana, date_format(ma.fecha, '%d/%m/%Y')                                 fecha, date_format(ma.fecha, '%T')                                       hora, concat('N', date_format(ma.fecha, '%y'), dayofyear(ma.fecha))     fechaJuliana, ma.no_parte, ma.cant_parte, concat('2623 ', date_format(ma.fecha, '%y'), dayofyear(ma.fecha)) RAN, c.nombre,nota invoice, id_candado padlock, id_contendor conteiner from (select * from movimientos_almacenes where id_destino is null and id_proveedor != 5 and year(fecha)=year(current_date())) ma join clientes c on ma.id_proveedor = c.id_cliente order by ma.fecha;`, function (err, rows) {
            if (err) return reject(err);
            else resolve(rows);
        });
    });
    let wb = new xl.Workbook({
        defaultFont: {
            size: 10,
            name: "Arial"
        }
    });
    let ws;
    //Fin de Pie de Documento

    let inicio = 6;
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let fecha = new Date(`${info[0].fecha.split('\/')[2]}`, `${info[0].fecha.split('\/')[1] - 1}`, `${info[0].fecha.split('\/')[0]}`);
    fecha.toLocaleDateString('es-MX', options);
    let meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];
    let bandera = true;
    let mes = meses[fecha.getMonth()];
    let cliente = info[0].nombre;
    let data = info[0];
    for (let i = 1; i <= info.length; i++) {
        //Crear Nueva Hoja
        if (bandera == true) {
            mes = meses[fecha.getMonth()];
            ws = wb.addWorksheet(`RCV ${mes} ${fecha.getFullYear()}`, {
                pageSetup: {
                    paperSize: 'LETTER_PAPER',
                    usePrinterDefaults: true,
                    fitToWidth: 1,
                    orientation: 'landscape'
                },
                sheetView: {
                    showGridLines: false
                },
                margins: {
                    bottom: 0,
                    top: 0
                },
                headerFooter: {
                    scaleWithDoc: true
                }
            });
            ws.column(9).setWidth(40);
            ws.cell(2, 2, 2, 12, true).string('Report production releases for the GMD2JC/LC and T250 parts').style({
                border: {
                    top: {
                        style: 'thin',
                        color: '#000000'
                    },
                    right: {
                        style: 'thin',
                        color: '#000000'
                    },
                    bottom: {
                        style: 'thin',
                        color: '#000000'
                    },
                    left: {
                        style: 'thin',
                        color: '#000000'
                    }
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center'
                }
            });
            //Encabezados
            ws.cell(4, 2, 4, 2, true).string('Week');
            ws.cell(4, 3, 4, 3, true).string('Date');
            ws.cell(4, 4, 4, 4, true).string('Time');
            ws.cell(4, 5, 4, 5, true).string('Order #');
            ws.cell(4, 6, 4, 6, true).string('Part#');
            ws.cell(4, 7, 4, 7, true).string('QTY');
            ws.cell(4, 8, 4, 8, true).string('RAN #');
            ws.cell(4, 9, 4, 9, true).string('Customer/Plant');
            ws.cell(4, 10, 4, 10, true).string('Invoice');
            ws.cell(4, 11, 4, 11, true).string('Padlock');
            ws.cell(4, 12, 4, 12, true).string('Conteiner');
            inicio = 6
            bandera = !bandera;
        }
        fecha = new Date(`${data.fecha.split('\/')[2]}`, `${data.fecha.split('\/')[1] - 1}`, `${data.fecha.split('\/')[0]}`);
        cliente = data.nombre;
        if (mes == meses[fecha.getMonth()]) {
            ws.cell(inicio, 2, inicio, 2, true).number(data.semana);
            ws.cell(inicio, 3, inicio, 3, true).string(`${data.fecha}`);
            ws.cell(inicio, 4, inicio, 4, true).string(`${data.hora}`);
            ws.cell(inicio, 5, inicio, 5, true).string(`${data.fechaJuliana}`);
            ws.cell(inicio, 6, inicio, 6, true).string(data.no_parte);
            ws.cell(inicio, 7, inicio, 7, true).number(data.cant_parte);
            ws.cell(inicio, 8, inicio, 8, true).string(`${data.RAN}`);
            ws.cell(inicio, 9, inicio, 9, true).string(`${data.nombre}`);
            ws.cell(inicio, 10, inicio, 10, true).string(`${data.invoice}`);
            ws.cell(inicio, 11, inicio, 11, true).string(`${data.padlock}`);
            ws.cell(inicio, 12, inicio, 12, true).string(`${data.conteiner}`);
            if (cliente != data.nombre) inicio += 2
            else {
                cliente = data.nombre;
                inicio++;
            }
            data = info[i];
        } else {
            bandera = !bandera;
        }


    }

    wb.write(path.join(__dirname, `../docs/Production releases for the ${req.params.nombre} ${fecha.getFullYear()} RCV.xlsx`), function (err) {
        if (err) throw err
        else {
            res.send({ message: 'Production Releases Receiving Creado', status: '200' });
        }
    });
});

api.get('/ReleaseShipments/:proyecto/:nombre', md_nivel.ensureLevel2, async function (req, res) {
    let info = null;
    info = await new Promise(function (resolve, reject) {
        con.query(`select week(ma.fecha)                                                    semana, date_format(ma.fecha, '%d/%m/%Y')                                 fecha, date_format(ma.fecha, '%T')                                       hora, concat('N', date_format(ma.fecha, '%y'), dayofyear(ma.fecha))     fechaJuliana, ma.no_parte, ma.cant_parte, concat('2623 ', date_format(ma.fecha, '%y'), dayofyear(ma.fecha)) RAN, c.nombre from (select fecha, m.no_parte, cant_parte, id_destino from movimientos_almacenes m inner join partes p on m.no_parte = p.no_parte where id_destino is not null and p.id_proyecto=${req.params.proyecto} and m.id_proveedor != 5 and year(fecha) = year(current_date())) ma inner join clientes c on ma.id_destino = c.id_cliente order by ma.fecha;`, function (err, rows) {
            if (err) return reject(err);
            else resolve(rows);
        });
    });
    let wb = new xl.Workbook({
        defaultFont: {
            size: 10,
            name: "Arial"
        }
    });
    let ws;
    //Fin de Pie de Documento

    let inicio = 6;
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let fecha = new Date(`${info[0].fecha.split('\/')[2]}`, `${info[0].fecha.split('\/')[1] - 1}`, `${info[0].fecha.split('\/')[0]}`);
    fecha.toLocaleDateString('es-MX', options);
    let meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];

    let bandera = true;
    let mes = meses[fecha.getMonth()];
    let cliente = info[0].nombre;
    let data = info[0];
    for (let i = 1; i <= info.length; i++) {
        //Crear Nueva Hoja
        if (bandera == true) {
            mes = meses[fecha.getMonth()];
            ws = wb.addWorksheet(`RCV ${mes} ${fecha.getFullYear()}`, {
                pageSetup: {
                    paperSize: 'LETTER_PAPER',
                    usePrinterDefaults: true,
                    fitToWidth: 1,
                    orientation: 'landscape'
                },
                sheetView: {
                    showGridLines: false
                },
                margins: {
                    bottom: 0,
                    top: 0
                },
                headerFooter: {
                    scaleWithDoc: true
                }
            });
            ws.column(9).setWidth(40);
            ws.cell(2, 2, 2, 9, true).string('Report production releases for the GMD2JC/LC and T250 parts').style({
                border: {
                    top: {
                        style: 'thin',
                        color: '#000000'
                    },
                    right: {
                        style: 'thin',
                        color: '#000000'
                    },
                    bottom: {
                        style: 'thin',
                        color: '#000000'
                    },
                    left: {
                        style: 'thin',
                        color: '#000000'
                    }
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center'
                }
            });
            //Encabezados
            ws.cell(4, 2, 4, 2, true).string('Week');
            ws.cell(4, 3, 4, 3, true).string('Date');
            ws.cell(4, 4, 4, 4, true).string('Time');
            ws.cell(4, 5, 4, 5, true).string('Order #');
            ws.cell(4, 6, 4, 6, true).string('Part#');
            ws.cell(4, 7, 4, 7, true).string('QTY');
            ws.cell(4, 8, 4, 8, true).string('RAN #');
            ws.cell(4, 9, 4, 9, true).string('Customer/Plant');
            inicio = 6
            bandera = !bandera;
        }
        fecha = new Date(`${data.fecha.split('\/')[2]}`, `${data.fecha.split('\/')[1] - 1}`, `${data.fecha.split('\/')[0]}`);
        cliente = data.nombre;
        if (mes == meses[fecha.getMonth()]) {
            ws.cell(inicio, 2, inicio, 2, true).number(data.semana);
            ws.cell(inicio, 3, inicio, 3, true).string(`${data.fecha}`);
            ws.cell(inicio, 4, inicio, 4, true).string(`${data.hora}`);
            ws.cell(inicio, 5, inicio, 5, true).string(`${data.fechaJuliana}`);
            ws.cell(inicio, 6, inicio, 6, true).string(data.no_parte);
            ws.cell(inicio, 7, inicio, 7, true).number(data.cant_parte);
            ws.cell(inicio, 8, inicio, 8, true).string(`${data.RAN}`);
            ws.cell(inicio, 9, inicio, 9, true).string(`${data.nombre}`);
            if (cliente != data.nombre) inicio += 2
            else {
                cliente = data.nombre;
                inicio++;
            }
            data = info[i];
        } else {
            bandera = !bandera;
        }
    }

    wb.write(path.join(__dirname, `../docs/Production releases for the ${req.params.nombre} ${fecha.getFullYear()} SHP.xlsx`), function (err) {
        if (err) throw err
        else {
            res.send({ message: 'Production Releases Shipment Creado', status: '200' });
        }
    });
});

api.get('/InventoryControl/:proyecto', md_nivel.ensureLevel2, async function (req, res) {
    let meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];
    let fechaCreacion = new Date();
    let wb = new xl.Workbook({
        defaultFont: {
            size: 10,
            name: "Arial"
        }
    });
    let ws;
    let info = null;
    for (let i = 1; i <= fechaCreacion.getMonth() + 1; i++) {
        info = await new Promise(function (resolve, reject) {
            con.query(`select p.no_parte, date_format(fecha, '%d/%m/%Y')                        fecha, floor(cant_anterior / p.cant_x_caja / cant_x_pallet)  pvr_case, cant_anterior, case when (id_destino is null) then floor(cant_parte / p.cant_x_caja / cant_x_pallet) when (id_destino is not null) then 0 end                                          rcv_case, case when (id_destino is null) then cant_parte when (id_destino is not null) then 0 end                                          rcv_qty, case when (id_destino is not null) then floor(cant_parte / p.cant_x_caja / cant_x_pallet) when (id_destino is null) then 0 end                                          shp_case, case when (id_destino is not null) then cant_parte when (id_destino is null) then 0 end                                          shp_qty, floor(cant_posterior / p.cant_x_caja / cant_x_pallet) end_case, ma.cant_posterior                                     end_qty, cq_ant, cq_post, svc_ant, svc_post from partes p left join movimientos_almacenes ma on ma.no_parte = p.no_parte where p.id_proveedor != 5 and month(fecha) = ${i} and p.id_proyecto = ${req.params.proyecto}          order by ma.no_parte, ma.id_movimiento;`, function (err, rows) {
                if (err) return reject(err);
                else resolve(rows);
            });
        });

        //Fin de Pie de Documento

        if (info.length >= 1) {
            let inicio = 11;
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            let fecha = new Date(`${info[0].fecha.split('\/')[2]}`, `${info[0].fecha.split('\/')[1] - 1}`, `${info[0].fecha.split('\/')[0]}`);
            fecha.toLocaleDateString('es-MX', options);

            let bandera = true;
            let mes = meses[fecha.getMonth()];
            let data = info[0];
            let comienzo = inicio;
            ws = wb.addWorksheet(`${mes}`, {
                pageSetup: {
                    paperSize: 'LETTER_PAPER',
                    usePrinterDefaults: true,
                    fitToWidth: 1,
                    orientation: 'landscape'
                },
                sheetView: {
                    showGridLines: false
                },
                margins: {
                    bottom: 0,
                    top: 0
                },
                headerFooter: {
                    scaleWithDoc: true
                }
            });
            ws.column(1).setWidth(2);
            ws.addImage({
                path: path.join(__dirname, '../client/production/images/gensenLogo.png'),
                type: 'picture',
                position: {
                    type: 'oneCellAnchor',
                    from: {
                        col: 2,
                        colOff: '0.2in',
                        row: 1,
                        rowOff: '0.05in'
                    },
                    to: {
                        col: 4,
                        colOff: 0,
                        row: 6,
                        rowOff: 0
                    }
                }
            });
            ws.cell(5, 2, 5, 2).string('NINGBO ZHONGJUN UEHARA');
            ws.cell(6, 2, 6, 2).string('AUTOMOBILE PARTS CO.,LTD');
            ws.cell(7, 2, 7, 2).string('TIANYUAN, CIXI,');
            ws.cell(8, 2, 8, 2).string('ZHEJIANG, PRC');
            ws.cell(9, 2, 9, 2).string('P. C. 315325');
            ws.cell(10, 2, 10, 2).string('AS OF');
            ws.cell(10, 3, 10, 3).string(`${fechaCreacion.getDate()}/${fechaCreacion.getMonth() + 1}/${fechaCreacion.getFullYear()}`); 7
            let index = 1;

            while (index <= info.length) {
                try {
                    if (bandera) {
                        ws.cell(inicio, 2, inicio, 2).string(`${data.no_parte}-OK`).style({
                            font: { bold: true, underline: true }
                        });
                        inicio++;
                        ws.cell(inicio, 3, inicio, 3).string('PRV CASE');
                        ws.cell(inicio, 4, inicio, 4).string('PRV QTY');
                        ws.cell(inicio, 5, inicio, 5).string('RCV CASE');
                        ws.cell(inicio, 6, inicio, 6).string('RCV QTY');
                        ws.cell(inicio, 7, inicio, 7).string('SHP CASE');
                        ws.cell(inicio, 8, inicio, 8).string('SHP QTY');
                        ws.cell(inicio, 9, inicio, 9).string('END CASE');
                        ws.cell(inicio, 10, inicio, 10).string('END QTY');
                        ws.cell(inicio, 11, inicio, 11).string('REMARKS');
                        inicio++;
                        comienzo = inicio;
                        ws.cell(inicio, 2, inicio, 2).string('BBF');
                        ws.cell(inicio, 3, inicio, 3).number(data.pvr_case);
                        ws.cell(inicio, 4, inicio, 4).number(data.cant_anterior);
                        ws.cell(inicio, 5, inicio, 5).number(data.rcv_case);
                        ws.cell(inicio, 6, inicio, 6).number(data.rcv_qty);
                        ws.cell(inicio, 7, inicio, 7).number(data.shp_case);
                        ws.cell(inicio, 8, inicio, 8).number(data.shp_qty);
                        ws.cell(inicio, 9, inicio, 9).number(data.end_case);
                        ws.cell(inicio, 10, inicio, 10).number(data.end_qty);
                        inicio++;
                        data = info[index];
                        bandera = !bandera;
                    }
                    if (data.no_parte == info[index - 1].no_parte) {
                        ws.cell(inicio, 2, inicio, 2).string(data.fecha);
                        ws.cell(inicio, 3, inicio, 3).number(data.pvr_case);
                        ws.cell(inicio, 4, inicio, 4).number(data.cant_anterior);
                        ws.cell(inicio, 5, inicio, 5).number(data.rcv_case);
                        ws.cell(inicio, 6, inicio, 6).number(data.rcv_qty);
                        ws.cell(inicio, 7, inicio, 7).number(data.shp_case);
                        ws.cell(inicio, 8, inicio, 8).number(data.shp_qty);
                        ws.cell(inicio, 9, inicio, 9).number(data.end_case);
                        ws.cell(inicio, 10, inicio, 10).number(data.end_qty);
                        index++;
                        data = info[index];
                        inicio++;
                    } else {
                        ws.cell(inicio, 2, inicio, 2).string('**TOTAL').style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 3, inicio, 3).formula(`=SUM(C${comienzo}:C${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 4, inicio, 4).formula(`=SUM(D${comienzo}:D${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 5, inicio, 5).formula(`=SUM(E${comienzo}:E${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 6, inicio, 6).formula(`=SUM(F${comienzo}:F${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 7, inicio, 7).formula(`=SUM(G${comienzo}:G${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 8, inicio, 8).formula(`=SUM(H${comienzo}:H${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 9, inicio, 9).formula(`=SUM(I${comienzo}:I${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 10, inicio, 10).formula(`=SUM(J${comienzo}:J${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        inicio++;
                        ws.cell(inicio, 2, inicio, 2).string(`${info[index - 1].no_parte}-QC`).style({
                            font: { bold: true, underline: true }
                        });
                        inicio++;
                        ws.cell(inicio, 3, inicio, 3).string('PRV CASE');
                        ws.cell(inicio, 4, inicio, 4).string('PRV QTY');
                        ws.cell(inicio, 5, inicio, 5).string('RCV CASE');
                        ws.cell(inicio, 6, inicio, 6).string('RCV QTY');
                        ws.cell(inicio, 7, inicio, 7).string('SHP CASE');
                        ws.cell(inicio, 8, inicio, 8).string('SHP QTY');
                        ws.cell(inicio, 9, inicio, 9).string('END CASE');
                        ws.cell(inicio, 10, inicio, 10).string('END QTY');
                        ws.cell(inicio, 11, inicio, 11).string('REMARKS');
                        inicio++;
                        comienzo = inicio;
                        ws.cell(inicio, 2, inicio, 2).string('BBF');
                        ws.cell(inicio, 3, inicio, 3).number(info[index - 1].cq_ant);
                        ws.cell(inicio, 4, inicio, 4).number(info[index - 1].cq_post);
                        ws.cell(inicio, 5, inicio, 5).number(0);
                        ws.cell(inicio, 6, inicio, 6).number(0);
                        ws.cell(inicio, 7, inicio, 7).number(0);
                        ws.cell(inicio, 8, inicio, 8).number(0);
                        ws.cell(inicio, 9, inicio, 9).number(info[index - 1].cq_ant);
                        ws.cell(inicio, 10, inicio, 10).number(info[index - 1].cq_post);
                        inicio++;
                        ws.cell(inicio, 2, inicio, 2).string('**TOTAL').style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 3, inicio, 3).formula(`=SUM(C${comienzo}:C${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 4, inicio, 4).formula(`=SUM(D${comienzo}:D${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 5, inicio, 5).formula(`=SUM(E${comienzo}:E${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 6, inicio, 6).formula(`=SUM(F${comienzo}:F${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 7, inicio, 7).formula(`=SUM(G${comienzo}:G${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 8, inicio, 8).formula(`=SUM(H${comienzo}:H${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 9, inicio, 9).formula(`=SUM(I${comienzo}:I${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 10, inicio, 10).formula(`=SUM(J${comienzo}:J${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        inicio++;
                        ws.cell(inicio, 2, inicio, 2).string(`${info[index - 1].no_parte}-SVC`).style({
                            font: { bold: true, underline: true }
                        });
                        inicio++;
                        ws.cell(inicio, 3, inicio, 3).string('PRV CASE');
                        ws.cell(inicio, 4, inicio, 4).string('PRV QTY');
                        ws.cell(inicio, 5, inicio, 5).string('RCV CASE');
                        ws.cell(inicio, 6, inicio, 6).string('RCV QTY');
                        ws.cell(inicio, 7, inicio, 7).string('SHP CASE');
                        ws.cell(inicio, 8, inicio, 8).string('SHP QTY');
                        ws.cell(inicio, 9, inicio, 9).string('END CASE');
                        ws.cell(inicio, 10, inicio, 10).string('END QTY');
                        ws.cell(inicio, 11, inicio, 11).string('REMARKS');
                        inicio++;
                        comienzo = inicio;
                        ws.cell(inicio, 2, inicio, 2).string('BBF');
                        ws.cell(inicio, 3, inicio, 3).number(info[index - 1].svc_ant);
                        ws.cell(inicio, 4, inicio, 4).number(info[index - 1].svc_post);
                        ws.cell(inicio, 5, inicio, 5).number(0);
                        ws.cell(inicio, 6, inicio, 6).number(0);
                        ws.cell(inicio, 7, inicio, 7).number(0);
                        ws.cell(inicio, 8, inicio, 8).number(0);
                        ws.cell(inicio, 9, inicio, 9).number(info[index - 1].svc_ant);
                        ws.cell(inicio, 10, inicio, 10).number(info[index - 1].svc_post);
                        inicio++;
                        ws.cell(inicio, 2, inicio, 2).string('**TOTAL').style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 3, inicio, 3).formula(`=SUM(C${comienzo}:C${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 4, inicio, 4).formula(`=SUM(D${comienzo}:D${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 5, inicio, 5).formula(`=SUM(E${comienzo}:E${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 6, inicio, 6).formula(`=SUM(F${comienzo}:F${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 7, inicio, 7).formula(`=SUM(G${comienzo}:G${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 8, inicio, 8).formula(`=SUM(H${comienzo}:H${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 9, inicio, 9).formula(`=SUM(I${comienzo}:I${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        ws.cell(inicio, 10, inicio, 10).formula(`=SUM(J${comienzo}:J${inicio - 1})`).style({
                            font: { bold: true }
                        });
                        inicio++;
                        index++;
                        bandera = !bandera;
                    }
                } catch (e) {
                    data = info[index - 1];
                    ws.cell(inicio, 2, inicio, 2).string('**TOTAL').style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 3, inicio, 3).formula(`=SUM(C${comienzo}:C${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 4, inicio, 4).formula(`=SUM(D${comienzo}:D${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 5, inicio, 5).formula(`=SUM(E${comienzo}:E${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 6, inicio, 6).formula(`=SUM(F${comienzo}:F${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 7, inicio, 7).formula(`=SUM(G${comienzo}:G${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 8, inicio, 8).formula(`=SUM(H${comienzo}:H${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 9, inicio, 9).formula(`=SUM(I${comienzo}:I${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 10, inicio, 10).formula(`=SUM(J${comienzo}:J${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    inicio++;
                    ws.cell(inicio, 2, inicio, 2).string(`${data.no_parte}-QC`).style({
                        font: { bold: true, underline: true }
                    });
                    inicio++;
                    ws.cell(inicio, 3, inicio, 3).string('PRV CASE');
                    ws.cell(inicio, 4, inicio, 4).string('PRV QTY');
                    ws.cell(inicio, 5, inicio, 5).string('RCV CASE');
                    ws.cell(inicio, 6, inicio, 6).string('RCV QTY');
                    ws.cell(inicio, 7, inicio, 7).string('SHP CASE');
                    ws.cell(inicio, 8, inicio, 8).string('SHP QTY');
                    ws.cell(inicio, 9, inicio, 9).string('END CASE');
                    ws.cell(inicio, 10, inicio, 10).string('END QTY');
                    ws.cell(inicio, 11, inicio, 11).string('REMARKS');
                    inicio++;
                    comienzo = inicio;
                    ws.cell(inicio, 2, inicio, 2).string('BBF');
                    ws.cell(inicio, 3, inicio, 3).number(data.cq_ant);
                    ws.cell(inicio, 4, inicio, 4).number(data.cq_post);
                    ws.cell(inicio, 5, inicio, 5).number(0);
                    ws.cell(inicio, 6, inicio, 6).number(0);
                    ws.cell(inicio, 7, inicio, 7).number(0);
                    ws.cell(inicio, 8, inicio, 8).number(0);
                    ws.cell(inicio, 9, inicio, 9).number(data.cq_ant);
                    ws.cell(inicio, 10, inicio, 10).number(data.cq_post);
                    inicio++;
                    ws.cell(inicio, 2, inicio, 2).string('**TOTAL').style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 3, inicio, 3).formula(`=SUM(C${comienzo}:C${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 4, inicio, 4).formula(`=SUM(D${comienzo}:D${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 5, inicio, 5).formula(`=SUM(E${comienzo}:E${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 6, inicio, 6).formula(`=SUM(F${comienzo}:F${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 7, inicio, 7).formula(`=SUM(G${comienzo}:G${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 8, inicio, 8).formula(`=SUM(H${comienzo}:H${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 9, inicio, 9).formula(`=SUM(I${comienzo}:I${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 10, inicio, 10).formula(`=SUM(J${comienzo}:J${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    inicio++;
                    ws.cell(inicio, 2, inicio, 2).string(`${data.no_parte}-SVC`).style({
                        font: { bold: true, underline: true }
                    });
                    inicio++;
                    ws.cell(inicio, 3, inicio, 3).string('PRV CASE');
                    ws.cell(inicio, 4, inicio, 4).string('PRV QTY');
                    ws.cell(inicio, 5, inicio, 5).string('RCV CASE');
                    ws.cell(inicio, 6, inicio, 6).string('RCV QTY');
                    ws.cell(inicio, 7, inicio, 7).string('SHP CASE');
                    ws.cell(inicio, 8, inicio, 8).string('SHP QTY');
                    ws.cell(inicio, 9, inicio, 9).string('END CASE');
                    ws.cell(inicio, 10, inicio, 10).string('END QTY');
                    ws.cell(inicio, 11, inicio, 11).string('REMARKS');
                    inicio++;
                    comienzo = inicio;
                    ws.cell(inicio, 2, inicio, 2).string('BBF');
                    ws.cell(inicio, 3, inicio, 3).number(data.svc_ant);
                    ws.cell(inicio, 4, inicio, 4).number(data.svc_post);
                    ws.cell(inicio, 5, inicio, 5).number(0);
                    ws.cell(inicio, 6, inicio, 6).number(0);
                    ws.cell(inicio, 7, inicio, 7).number(0);
                    ws.cell(inicio, 8, inicio, 8).number(0);
                    ws.cell(inicio, 9, inicio, 9).number(data.svc_ant);
                    ws.cell(inicio, 10, inicio, 10).number(data.svc_post);
                    inicio++;
                    ws.cell(inicio, 2, inicio, 2).string('**TOTAL').style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 3, inicio, 3).formula(`=SUM(C${comienzo}:C${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 4, inicio, 4).formula(`=SUM(D${comienzo}:D${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 5, inicio, 5).formula(`=SUM(E${comienzo}:E${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 6, inicio, 6).formula(`=SUM(F${comienzo}:F${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 7, inicio, 7).formula(`=SUM(G${comienzo}:G${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 8, inicio, 8).formula(`=SUM(H${comienzo}:H${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 9, inicio, 9).formula(`=SUM(I${comienzo}:I${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    ws.cell(inicio, 10, inicio, 10).formula(`=SUM(J${comienzo}:J${inicio - 1})`).style({
                        font: { bold: true }
                    });
                    inicio++;
                    index++;
                }
            }
        }
    }
    wb.write(path.join(__dirname, `../docs/Inventory Control ${info[0].proyecto}.xlsx`), function (err) {
        if (err) res.send({ message: 'Ocurrió un Error', status: 500 })
        else {
            res.send({ message: 'Archivo creado', status: 200 });
        }
    });

});

module.exports = api;