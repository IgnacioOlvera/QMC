var xl = require('excel4node');
var express = require('express');
var api = express.Router();

api.post('/BillOfLanding', function (req, res) {

    info = req.body;
    console.log(info);
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
            vertical:'center'
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
        path: '../client/production/images/QMC_LOGO2.png',
        type: 'picture',
        position: {
            type: 'oneCellAnchor',
            from: {
                col: 2,
                colOff: 0,
                row: 1,
                rowOff: 0
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
        },border:{
            right:{
                style:'thin',
                color:'#000000'
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
            right:{
                style:'thin',
                color:'#000000'
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
    if(inicio-3<=63){
        while(inicio!=62){
            ws.cell(inicio, 1, inicio + 2, 2, true).style(estiloLista);
            ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
            ws.cell(inicio, 5, inicio + 2, 12, true).style(estiloLista);
            ws.cell(inicio, 13, inicio + 2, 15, true).style(estiloLista);
            ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
            inicio+=3;
        }
    }
    ws.cell(inicio, 1, inicio + 2, 2, true).style(estiloLista);
    ws.cell(inicio, 3, inicio + 2, 4, true).style(estiloLista);
    ws.cell(inicio, 5, inicio + 2, 12, true).string([{ bold: true, size: 14 }, `Sello: ${info.candado}   Total:544 kg`]).style(estiloLista);
    ws.cell(inicio, 13, inicio + 2, 15, true).style(estiloLista);
    ws.cell(inicio, 16, inicio + 2, 19, true).style(estiloLista);
    inicio+=3;
    console.log(inicio);
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
            right:{
                style:'thin',
                color:'#000000'
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
    ws.cell(inicio, 13, inicio + 1,19 , true).string([{ name: 'Arial', size: 6, color: '#00ccff', bold: true }, `Emergency Response Phone Number`]).style({
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
            vertical:'top'
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
    ws.cell(54,20,64,23,true).style(AllBorder);
    ws.cell(65,20,74,23,true).string([{color:'#ff0000',size:7.5,name:'Arial'},'C.O.D SHIPMENT\n\n\nC.O.D AMT_______\n\n\nCollection Free______\n\n\nTotal Charges______']).style({
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical:'center'
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
    wb.write(`../docs/Bill Of Landing ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}.xlsx`, function (err) {
        if (err) throw err
        else {
            res.send({ message: 'Archivo creado', status: '200' });
        }
    });
});
module.exports = api;