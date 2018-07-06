var xl = require('excel4node');
var express = require('express');
var api = express.Router();
var path =require('path');

api.post('/BillOfLanding', function (req, res) {
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
        path: path.join(__dirname,'../client/production/images/QMC_LOGO2.png'),
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
        path: '../client/production/images/check.png',
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
        path: '../client/production/images/check.png',
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
    }, `${info.cliente[0].nombre}\n`,
    {
        bold: false,
        size: 11,
        name: 'Arial'
    }, `${info.cliente[0].direccion}\nRFC:${info.cliente[0].RFC}`
    ]).style(bordeadoJustificado);
    ws.cell(24, 12, 24, 23, true).string([{
        size: 7.5
    }, 'BY']).style(AllBorder);

    ws.cell(25, 12, 26, 23, true).string('Inoplast Composities').style(AllBorder);

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
    for (i in info.partes) {
        let parte = info.partes[i];
        let cant_caja = parte.cant_x_caja;
        let cant_pallet = parte.cant_x_pallet;
        let cant = parte.cant;
        let tot_cajas = Math.floor(cant / cant_caja);
        let tot_pallets = Math.floor(tot_cajas / cant_pallet);

        ws.cell(inicio, 1, inicio + 2, 2, true).string(`${tot_pallets} Plt`).style(estiloLista);
        ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
        ws.cell(inicio, 5, inicio + 2, 12, true).string(`${parte.no_parte}-${parte.descripcion}\n${tot_cajas}@${cant_caja}`).style(estiloLista);
        ws.cell(inicio, 13, inicio + 2, 15, true).style(estiloLista);
        ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
        inicio += 3;
    }
    if (inicio - 3 <= 63) {
        while (inicio != 62) {
            ws.cell(inicio, 1, inicio + 2, 2, true).style(estiloLista);
            ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
            ws.cell(inicio, 5, inicio + 2, 12, true).style(estiloLista);
            ws.cell(inicio, 13, inicio + 2, 15, true).style(estiloLista);
            ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
            inicio += 3;
        }
    }
    ws.cell(inicio, 1, inicio + 2, 2, true).style(estiloLista);
    ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
    ws.cell(inicio, 5, inicio + 2, 12, true).string([{ bold: true, size: 14 }, `Sello: ${info.candado}   Total:544 kg`]).style(estiloLista);
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
    wb.write(`../api/docs/Bill Of Landing ${info.cliente[0].nombre} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}.xlsx`, function (err) {
        if (err) throw err
        else {
            res.send({ message: 'Archivo creado', status: '200' });
        }
    });
});

api.post('/OrderSheet', function (req, res) {
    let info = req.body;
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
        path: '../client/production/images/QMC_LOGO2.png',
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
    }, info.cliente[0].nombre + "\n",
    {
        bold: false,
        size: 11,
        name: 'Arial'
    }, info.cliente[0].direccion
    ]).style(bordeadoJustificado);

    ws.cell(14, 4, 20, 14, true).string([{
        bold: true,
        size: 11,
        name: 'Arial',
    }, info.cliente[1].nombre + "\n",
    {
        bold: false,
        size: 11,
        name: 'Arial'
    }, info.cliente[1].nombre
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
    ws.cell(11, 19, 11, 23, true).string([{ size: 11 }, "Luis Macías"]).style(styleDetalle);

    ws.cell(12, 16, 12, 18, true).string([{ size: 7.5 }, "BATCH RELEASER"]).style(styleDetalle);
    ws.cell(12, 19, 12, 23, true).string([{ size: 11 }, "Luis Macías"]).style(styleDetalle);

    ws.cell(13, 16, 13, 18, true).string([{ size: 7.5 }, "LOT  CHARGE"]).style(styleDetalle);
    ws.cell(13, 19, 13, 23, true).string([{ size: 11 }, "Leader Logistic"]).style(styleDetalle);
    //Encabezados de Tablas
    ws.cell(22, 1, 23, 1, true).string("NO.").style(styleEncanbezados);
    ws.cell(22, 2, 23, 7, true).string("PARTS NUMBER").style(styleEncanbezados);
    ws.cell(22, 7, 23, 7, true).string("QUANTITY").style(styleEncanbezados);
    ws.cell(22, 8, 23, 8, true).string("QTY/CASE").style(styleEncanbezados);
    ws.cell(22, 9, 23, 10, true).string("CASE").style(styleEncanbezados);
    ws.cell(22, 11, 23, 14, true).string("PRICE").style(styleEncanbezados);
    ws.cell(22, 15, 23, 16, true).string("MODL YEAR").style(styleEncanbezados);
    ws.cell(22, 17, 23, 18, true).string("ORDER #").style(styleEncanbezados);
    ws.cell(22, 19, 23, 20, true).string("REF #").style(styleEncanbezados);
    ws.cell(22, 21, 23, 23, true).string("REMARKS").style(styleEncanbezados);
    let inicio = 24;
    for (index in info.partes) {
        let parte = info.partes[index];
        let cant_caja = parte.cant_x_caja;
        let cant_pallet = parte.cant_x_pallet;
        let cant = parte.cant;
        let tot_cajas = Math.floor(cant / cant_caja);
        let tot_pallets = Math.floor(tot_cajas / cant_pallet);
        ws.cell(inicio, 1, inicio + 1, 1, true).string(index).style(styleLista);
        ws.cell(inicio, 2, inicio + 1, 7, true).string(parte.no_parte).style(styleLista);
        ws.cell(inicio, 7, inicio + 1, 7, true).string(cant).style(styleLista);
        ws.cell(inicio, 8, inicio + 1, 8, true).string(`${cant_caja}`).style(styleLista);
        ws.cell(inicio, 9, inicio + 1, 10, true).string(`${tot_cajas}`).style(styleLista);
        ws.cell(inicio, 11, inicio + 1, 14, true).string("0.000").style(styleLista);
        ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
        ws.cell(inicio, 17, inicio + 1, 18, true).string(`2623 ${fecha.getFullYear().toString().substr(2, 2)}${dia}`).style(styleLista);
        ws.cell(inicio, 19, inicio + 1, 20, true).style(styleLista);
        ws.cell(inicio, 21, inicio + 1, 23, true).string(`${tot_pallets}`).style(styleLista);
        inicio += 2;
    }
    if (inicio < 64) {
        while (inicio != 64) {
            ws.cell(inicio, 1, inicio + 1, 1, true).style(styleLista);
            ws.cell(inicio, 2, inicio + 1, 7, true).style(styleLista);
            ws.cell(inicio, 7, inicio + 1, 7, true).style(styleLista);
            ws.cell(inicio, 8, inicio + 1, 8, true).style(styleLista);
            ws.cell(inicio, 9, inicio + 1, 10, true).style(styleLista);
            ws.cell(inicio, 11, inicio + 1, 14, true).style(styleLista);
            ws.cell(inicio, 15, inicio + 1, 16, true).style(styleLista);
            ws.cell(inicio, 17, inicio + 1, 18, true).style(styleLista);
            ws.cell(inicio, 19, inicio + 1, 20, true).style(styleLista);
            ws.cell(inicio, 21, inicio + 1, 23, true).style(styleLista);
            inicio += 2;
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
    ws.cell(64, 12, 68, 23, true).string([{ bold: true, size: 11 }, "Quality & Manufacturing Consulting S.C.\n", { bold: false }, "Circuito Aguascalientes Sur 115-E\nParque Industrial del Valle de Aguascalientes", { bold: true }, "C.P.", { bold: false }, "20355\nAguascalientes, Ags.", { bold: true }, "RFC: Q&M0102157F1"]).style({
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

    wb.write(`../docs/Order Sheet ${info.cliente[0].nombre} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}.xlsx`, function (err) {
        if (err) throw err
        else {
            res.send({ message: 'Archivo creado', status: '200' });
        }
    });



});

api.post('/PackingList', function (req, res) {
    let info = req.body;
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
        path: path.join(__dirname,'../client/production/images/QMC_LOGO2.png'),
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

    ws.cell(5, 2, 8, 21, true).string([{ bold: true, size: 11 }, "Quality & Manufacturing Consulting S.C.\n", { bold: false }, "Circuito Aguascalientes Sur 115-E\nParque Industrial del Valle de Aguascalientes", { bold: true }, "C.P.", { bold: false }, "20355\nAguascalientes, Ags.", { bold: true }, "RFC: Q&M0102157F1"]).style({
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
    ws.cell(11, 1, 15, 13, true).string([{ bold: true, name: 'Calibri' }, info.cliente[0].nombre + "\n", { bold: false, name: 'Calibri' }, info.cliente[0].direccion + "\n", { bold: true, name: 'Calibri' }, `RFC: ${info.cliente[0].RFC}`]).style({
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'center'
        }
    });

    ws.cell(16, 1, 20, 13, true).string([{ bold: true, name: 'Calibri' }, info.cliente[0].nombre + "\n", { bold: false, name: 'Calibri' }, info.cliente[0].direccion + "\n", { bold: true, name: 'Calibri' }]).style({
        alignment: {
            wrapText: true,
            horizontal: 'left',
            vertical: 'center'
        }
    });
    //Información general
    ws.cell(11, 15, 11, 17, true).string([{ size: 7.5 }, "DUNS NO"]).style(bordeado);
    ws.cell(11, 18, 11, 21, true).string([{ size: 7.5 }, `N${fecha.getFullYear().toString().substr(2, 2)}${dia}`]).style(bordeado);

    ws.cell(12, 15, 12, 17, true).string([{ size: 7.5 }, "SHIP DATE"]).style(bordeado);
    ws.cell(12, 18, 12, 21, true).string([{ size: 7.5 }, `${mes} ${fecha.getDate()},${fecha.getFullYear()}`]).style(bordeado);

    ws.cell(13, 15, 13, 17, true).string([{ size: 7.5 }, "BATCH RELEASER"]).style(bordeado);
    ws.cell(13, 18, 13, 21, true).string([{ size: 7.5 }, "LUIS MACIAS"]).style(bordeado);

    ws.cell(15, 15, 15, 17, true).string([{ size: 7.5 }, "B/L NO."]).style(bordeado);
    ws.cell(15, 18, 15, 21, true).string([{ size: 7.5 }, `N${fecha.getFullYear().toString().substr(2, 2)}${dia}`]).style(bordeado);

    ws.cell(16, 15, 16, 17, true).string([{ size: 7.5 }, "CARRIER"]).style(bordeado);
    ws.cell(16, 18, 16, 21, true).string([{ size: 7.5 }, "INOPLAST COMPOSITIES"]).style(bordeado);

    ws.cell(17, 15, 17, 17, true).string([{ size: 7.5 }, "TOTAL PALLET"]).style(bordeado);
    ws.cell(17, 18, 17, 21, true).string([{ size: 7.5 }, "TOT_PALLET"]).style(bordeado);

    ws.cell(17, 15, 17, 17, true).string([{ size: 7.5 }, "TOTAL WEIGHT"]).style(bordeado);
    ws.cell(17, 18, 17, 21, true).string([{ size: 7.5 }, "544"]).style(bordeado);

    ws.cell(22, 1, 23, 1, true).string("NO.").style(styleEncanbezados);
    ws.cell(22, 2, 23, 6, true).string("PART NUMBER").style(styleEncanbezados);
    ws.cell(22, 7, 23, 12, true).string("DESCRIPTION").style(styleEncanbezados);
    ws.cell(22, 13, 23, 14, true).string("CASE").style(styleEncanbezados);
    ws.cell(22, 15, 23, 16, true).string("QTY/CASE").style(styleEncanbezados);
    ws.cell(22, 17, 23, 18, true).string("QUANTTITY").style(styleEncanbezados);
    ws.cell(22, 19, 23, 21, true).string("REMARKS").style(styleEncanbezados);

    let inicio = 24;
    for (index in info.partes) {
        let parte = info.partes[index];
        let cant_caja = parte.cant_x_caja;
        let cant_pallet = parte.cant_x_pallet;
        let cant = parte.cant;
        let tot_cajas = Math.floor(cant / cant_caja);
        let tot_pallets = Math.floor(tot_cajas / cant_pallet);
        ws.cell(inicio, 1, inicio + 1, 1, true).string(index).style(styleLista);
        ws.cell(inicio, 2, inicio + 1, 6, true).string(parte.no_parte).style(styleLista);
        ws.cell(inicio, 7, inicio + 1, 12, true).string(parte.descripcion).style(styleLista);
        ws.cell(inicio, 13, inicio + 1, 14, true).string(`${cant_caja}`).style(styleLista);
        ws.cell(inicio, 15, inicio + 1, 16, true).string(`${tot_cajas}`).style(styleLista);
        ws.cell(inicio, 17, inicio + 1, 18, true).string(parte.cant).style(styleLista);
        ws.cell(inicio, 19, inicio + 1, 21, true).string(`${tot_pallets}`).style(styleLista);
        inicio += 2;
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

    ws.cell(64, 1, 64, 21, true).string([{ name: 'Verdana', size: 11 }, "QMC Form NLV 12  dated: Oct 21, 2010"]).style({
        border:{
            top:{
                style:'thin',
                color:'#000000'
            }
        }
    });
    ws.cell(66, 3, 66, 15, true).string([{ name: 'Verdana', size: 11 }, "RECEIVED BY______________________________   on ___________________"]);
    ws.cell(67, 5, 67, 6, true).string([{ name: 'Verdana', size: 7 }, "Signature"]);
    ws.cell(66, 17, 66, 21, true).style({
        border: {
            bottom:{
                style:'thin',
                color:'#000000'
            }
        }
    });
    ws.cell(67, 17, 67, 21, true).string([{ name: 'Verdana', size: 9 }, "Release"]).style({
        alignment:{
            horizontal:'center',
            vertical:'center'
        }
    });

    ws.cell(71, 3, 71, 8, true).style({
        border: {
            bottom:{
                style:'thin',
                color:'#000000'
            }
        }
    });
    ws.cell(71, 11, 71, 15, true).style({
        border: {
            bottom:{
                style:'thin',
                color:'#000000'
            }
        }
    });
    ws.cell(72, 11, 72, 12, true).string([{ name: 'Verdana', size: 9 }, "Printed Name"]);
    ws.cell(72, 17, 72, 19, true).string([{ name: 'Verdana', size: 9 }, "Trucking Company"]);

    wb.write(`../api/docs/Packing List ${info.cliente[0].nombre} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}.xlsx`, function (err) {
        if (err) throw err
        else {
            res.send({ message: 'Archivo creado', status: '200' });
        }
    });
});

module.exports = api;