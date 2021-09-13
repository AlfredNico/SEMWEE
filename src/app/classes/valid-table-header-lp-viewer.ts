let res = false;
export class ValidTableHeaderLpViewer
{
    private headerValue: string[];

    constructor(headerValue: string[]) {
        this.headerValue = [ ...headerValue ];
    }

    

    public async generateValidHeader(): Promise<Boolean> {
        let header = [];
        console.log( "headerValue : ", this.headerValue );
        header = this.headerValue;
        if ( header.length == 0 )
        {
            console.log( "Empty header" );
        }
        let newHeader = [];
        await ProcessHeader( header, 0, "id", newHeader, 1 );
        console.log( "res : ", res );
        return res;
    }
}

async function ProcessHeader ( header: Array<String>, index, label, newHeader: Array<String>, iteration )
{
    console.log( "label : ", label );
    console.log( "current header : ", header[ index ].toLowerCase().replace( "\r", "" ) );
    console.log( "index : ", index );
    console.log( "iteration : ", iteration );
    if ( header[ index ].toLowerCase().replace( "\r", "" ) == "vide" )
    {
        alert( 'Csv column must be more than 1' );
        return false;
    }else if ( label == "id" )
    {
        console.log( 'ID searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "id" )
        {
            index = index + 1;
            await ProcessHeader( header, index, "category", newHeader, 1 );
        }
        else
        {
            await ProcessHeader( header, index, "category", newHeader, 1 );
        }
    } else if ( label == "category" )
    {
        console.log( 'Category searching...' );
        let head = header[ index ].toLowerCase().replace( "\r", "" );
        if ( head == "category" )
        {
            head = "category 1";
        } else if ( head == "category id" )
        {
            head = "category 1 id";
        }
        console.log( "head cat : ", head );
        console.log( "test avec iteration : ", "category " + iteration.toString() );
        if ( head == "category " + iteration.toString() )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                console.log( "index : ", index );
                head = header[ index ].toLowerCase().replace( "\r", "" );
                if ( head == "category id" )
                {
                    head = "category 1 id";
                }
                if ( head == "category " + iteration.toString() + " id" )
                {
                    console.log( "current header : ", header[ index ] );
                    console.log( "index : ", index );
                    if ( index + 1 < header.length )
                    {
                        index = index + 1;
                        iteration++;
                        await ProcessHeader( header, index, "category", newHeader, iteration );
                    } else
                    {
                        console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                    }
                } else
                {
                    await ProcessHeader( header, index, "category", newHeader, iteration );
                }
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            iteration = 1;
            await ProcessHeader( header, index, "subcategory", newHeader, iteration );
        }
    } else if ( label == "subcategory" )
    {
        console.log( 'Subcategory searching...' );
        let head = header[ index ].toLowerCase().replace( "\r", "" );
        if ( head == "subcategory" )
        {
            head = "subcategory 1";
        } else if ( head == "subcategory id" )
        {
            head = "subcategory 1 id";
        }
        console.log( "head subcatcat : ", head );
        console.log( "test avec iteration : ", "subcategory " + iteration.toString() );
        if ( head == "subcategory " + iteration.toString() )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                console.log( "index : ", index );
                head = header[ index ].toLowerCase().replace( "\r", "" );
                if ( head == "subcategory id" )
                {
                    head = "subcategory 1 id";
                }
                if ( head == "subcategory " + iteration.toString() + " id" )
                {
                    console.log( "current header : ", header[ index ] );
                    console.log( "index : ", index );
                    if ( index + 1 < header.length )
                    {
                        index = index + 1;
                        iteration++;
                        await ProcessHeader( header, index, "subcategory", newHeader, iteration );
                    } else
                    {
                        console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                    }
                } else
                {
                    await ProcessHeader( header, index, "subcategory", newHeader, iteration );
                }
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            iteration = 1;
            await ProcessHeader( header, index, "facet", newHeader, iteration );
        }
    } else if ( label == "facet" )
    {
        console.log( 'Facet searching...' );
        let head = header[ index ].toLowerCase().replace( "\r", "" );
        if ( head == "facet" )
        {
            head = "facet 1";
        } else if ( head == "facet id" )
        {
            head = "facet 1 id";
        }
        console.log( "head facet : ", head );
        console.log( "test avec iteration : ", "facet " + iteration.toString() );
        if ( head == "facet " + iteration.toString() )
        {
            console.log( "tafiditra facet" );
            if ( index + 1 < header.length )
            {
                index = index + 1;
                console.log( "index : ", index );
                head = header[ index ].toLowerCase().replace( "\r", "" );
                if ( head == "facet id" )
                {
                    head = "facet 1 id";
                }
                if ( head == "facet " + iteration.toString() + " id" )
                {
                    console.log( "tafiditra facet id" );
                    console.log( "current header : ", header[ index ] );
                    console.log( "index : ", index );
                    if ( index + 1 < header.length )
                    {
                        index = index + 1;
                        console.log( "index : ", index );
                        head = header[ index ].toLowerCase().replace( "\r", "" );
                        if ( head == "facet value" )
                        {
                            head = "facet 1 value";
                        }
                        if ( head == "facet " + iteration.toString() + " value" )
                        {
                            console.log( "tafiditra facet value" );
                            console.log( "current header : ", header[ index ].toLowerCase().replace( "\r", "" ) );
                            console.log( "index : ", index );
                            if ( index + 1 < header.length )
                            {
                                index = index + 1;
                                console.log( "index : ", index );
                                head = header[ index ].toLowerCase().replace( "\r", "" );
                                if ( head == "facet value id" )
                                {
                                    head = "facet 1 value id";
                                } if ( head == "facet " + iteration.toString() + " value id" )
                                {
                                    console.log( "tafiditra facet value id                   " );
                                    console.log( "current header : ", header[ index ].toLowerCase().replace( "\r", "" ) );
                                    console.log( "index : ", index );
                                    if ( index + 1 < header.length )
                                    {
                                        index = index + 1;
                                        iteration++;
                                        await ProcessHeader( header, index, "facet", newHeader, iteration );
                                    } else
                                    {
                                        console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                                    }
                                } else
                                {
                                    await ProcessHeader( header, index, "facet", newHeader, iteration );
                                }
                            } else
                            {
                                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                            }
                        } else
                        {
                            // console.log( "\"Facet", iteration, "value\" missing" );
                            res = false;
                            alert("\"Facet "+ iteration+ " value\" missing");
                        }
                    } else
                    {
                        // console.log( "\"Facet", iteration, "value\" missing" );
                        res = false;
                        alert( "\"Facet " + iteration + " value\" missing" );
                    }
                } else
                {
                    if ( head == "facet value" )
                    {
                        head = "facet 1 value";
                    }
                    if ( head == "facet " + iteration.toString() + " value" )
                    {
                        console.log( "current header : ", header[ index ] );
                        console.log( "index : ", index );
                        if ( index + 1 < header.length )
                        {
                            index = index + 1;
                            iteration++;
                            console.log( "index : ", index );
                            head = header[ index ].toLowerCase().replace( "\r", "" );
                            if ( head == "facet value id" )
                            {
                                head = "facet 1 value id";
                            } if ( head == "facet " + iteration.toString() + " value id" )
                            {
                                console.log( "current header : ", header[ index ] );
                                console.log( "index : ", index );
                                if ( index + 1 < header.length )
                                {
                                    index = index + 1;
                                    iteration++;
                                    await ProcessHeader( header, index, "facet", newHeader, iteration );
                                } else
                                {
                                    console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                                }
                            } else
                            {
                                await ProcessHeader( header, index, "facet", newHeader, iteration );
                            }
                        } else
                        {
                            console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                        }
                    } else
                    {
                        // console.log( "\"Facet", iteration, "value\" missing" );
                        res = false;
                        alert( "\"Facet " + iteration + " value\" missing" );
                    }
                }
            } else
            {
                // console.log( "\"Facet", iteration, "value\" missing" );
                res = false;
                alert( "\"Facet " + iteration + " value\" missing" );
            }
        }
        else
        {
            iteration = 1;
            await ProcessHeader( header, index, "path", newHeader, iteration );
        }
    } else if ( label == "path" )
    {
        console.log( 'Path searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "path" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "name", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "name", newHeader, 1 );
        }
    }else if ( label == "name" )
    {
        console.log( 'Path searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "name" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "full title", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "full title", newHeader, 1 );
        }
    }else if ( label == "full title" )
    {
        console.log( 'full title searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "full title" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "short title", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "short title", newHeader, 1 );
        }
    }else if ( label == "short title" )
    {
        console.log( 'short title searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "short title" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "main heading", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "main heading", newHeader, 1 );
        }
    }else if ( label == "main heading" )
    {
        console.log( 'main heading searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "main heading" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "meta description", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "meta description", newHeader, 1 );
        }
    }else if ( label == "meta description" )
    {
        console.log( 'meta description searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "meta description" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "rel canonical tag", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "rel canonical tag", newHeader, 1 );
        }
    }else if ( label == "rel canonical tag" )
    {
        console.log( 'rel canonical tag searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "rel canonical tag" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "meta name robots index", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "meta name robots index", newHeader, 1 );
        }
    }else if ( label == "meta name robots index" )
    {
        console.log( 'meta name robots index searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "meta name robots index" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "meta name robots follow", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "meta name robots follow", newHeader, 1 );
        }
    }else if ( label == "meta name robots follow" )
    {
        console.log( 'meta name robots follow searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "meta name robots follow" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "x-robots-tag index", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "x-robots-tag index", newHeader, 1 );
        }
    }else if ( label == "x-robots-tag index" )
    {
        console.log( 'x-robots-tag index searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "x-robots-tag index" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "x-robots-tag follow", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "x-robots-tag follow", newHeader, 1 );
        }
    }else if ( label == "x-robots-tag follow" )
    {
        console.log( 'x-robots-tag follow searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "x-robots-tag follow" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "x-robots-tag canonical", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "x-robots-tag canonical", newHeader, 1 );
        }
    }else if ( label == "x-robots-tag canonical" )
    {
        console.log( 'x-robots-tag canonical searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "x-robots-tag canonical" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "meta keywords", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "meta keywords", newHeader, 1 );
        }
    }else if ( label == "meta keywords" )
    {
        console.log( 'meta keywords searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "meta keywords" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "description", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "description", newHeader, 1 );
        }
    }else if ( label == "description" )
    {
        console.log( 'description ' + iteration.toString() + ' searching...' );
        let head = header[ index ].toLowerCase().replace( "\r", "" );
        if ( head == "description" )
        {
            head = "description 1"
        }
        if ( head == "description "+iteration.toString() )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                iteration++;
                await ProcessHeader( header, index, "description", newHeader, iteration );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "tags", newHeader, 1 );
        }
    }else if ( label == "tags" )
    {
        console.log( 'tags searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "tags" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "price", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "price", newHeader, 1 );
        }
    }else if ( label == "price" )
    {
        console.log( 'price searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "price" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "currency", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "currency", newHeader, 1 );
        }
    }else if ( label == "currency" )
    {
        console.log( 'currency searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "currency" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "available", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "available", newHeader, 1 );
        }
    }else if ( label == "available" )
    {
        console.log( 'available searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "available" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "main image", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "main image", newHeader, 1 );
        }
    }else if ( label == "main image" )
    {
        console.log( 'main image searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "main image" )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                await ProcessHeader( header, index, "main image alt", newHeader, 1 );
            } else
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            }
        }
        else
        {
            await ProcessHeader( header, index, "main image alt", newHeader, 1 );
        }
    }else if ( label == "main image alt" )
    {
        console.log( 'main image alt searching...' );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "main image alt" )
        {
            if ( header[ index-1 ].toLowerCase().replace( "\r", "" ) == "main image" )
            {
                if ( index + 1 < header.length )
                {
                    index = index + 1;
                    await ProcessHeader( header, index, "custom data", newHeader, 1 );
                } else
                {
                    console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                }
            } else
            {
                // console.log( '"Main image" missing' );
                res = false;
                alert( '"Main image" missing' );
            }
        }
        else
        {
            await ProcessHeader( header, index, "custom data", newHeader, 1 );
        }
    }else if ( label == "custom data" )
    {
        console.log( 'custom data name ' + iteration.toString() + ' searching...' );
        console.log( 'current header : ', header[ index ].toLowerCase().replace( "\r", "" ) );
        if ( header[ index ].toLowerCase().replace( "\r", "" ) == "custom data name "+iteration.toString() )
        {
            if ( index + 1 < header.length )
            {
                index = index + 1;
                if ( header[ index ].toLowerCase().replace( "\r", "" ) == "custom data " + iteration.toString() )
                {
                    console.log( "header length : ", header.length );
                    if ( index + 1 < header.length )
                    {
                        index = index + 1;
                        iteration++;
                        await ProcessHeader( header, index, "custom data", newHeader, iteration );
                    } else
                    {
                        console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
                    }
                }
                else
                {
                    res = false;
                    alert( '"custom data ' + iteration.toString() + '" missing' );
                }
            }else
            {
                res = false;
                alert( '"custom data ' + iteration.toString() + '" missing' );
            }
        }
        else
        {
            console.log( "index : ", index );
            console.log( "header length : ", header.length );
            if ( index > header.length )
            {
                console.log( 'ProcessHeader operation finished successfuly' );
                res = true;
            } else
            {
                res = false;
                alert( 'Error on column ' + ( index + 1 ) );
            }
        }
    }else 
    {
        res = false;
        alert( 'Error on column ' + ( index + 1 ) );
    }
}
