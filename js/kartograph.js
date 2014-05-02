//Fonction d'affichage de la carte ortho.svg
                        function kartoLoad(bubbles){
								var param = YAML.load('res/param.yaml');
								console.log(param.clustering_size);
								console.log(param.map_width);
								console.log(param.map_height);
                                var map = $K.map('#map', param.map_width, param.map_height );
                                map.loadMap('res/actualtest.svg', function() {
										//affichage des frontières des pays avec l'ajout de la couche countries 
										map.addLayer('countries', {
											id: 'bg',
											styles: {
												stroke: '#d8d6d4',
												'stroke-width': 5,
												'stroke-linejoin': 'round'
											}
										});
										
                                        map.addLayer('countries', {
                                                styles: {
													stroke: '#333',
													fill: '#fff'
												},
                                                title: function(d) {
                                                        return d.countryName;
                                                }
                                        });

                                        //https://github.com/kartograph/kartograph.py/issues/62
                                        //http://kartograph.org/docs/kartograph.js/symbols.html
                                        
										//ajout de symbole : cercle définit par la latitude, longitude et taille du cercle : radius
                                        map.addSymbols({
                                                type: kartograph.Bubble,
                                                data: bubbles,
                                                location: function(d) { return [d.lon, d.lat] },
                                                radius: function(d) { return  Math.sqrt(d.radius); },
                                                style: 'fill:#800; stroke: #fff; fill-opacity: 0.5;',
                                                title: function(d) { 
                                                        return d.city_name+' '+d.radius+' visits';
                                                },
                                                
												sortBy: 'radius desc',
                                                clustering: 'k-means',
                                                clusteringOpts: { 	//Changement du clusturing
                                                       size: param.clustering_size
                                                },
                                                aggregate: sumBubbles
                                        });
                                        
                                });
                        };
                        //Clusturing somme des cercles
                        function sumBubbles(bubbles) {
                                var total = { radius: 0, city_names: [] };
                                $.each(bubbles, function(i, b) {
                                        total.radius += b.radius;
                                        
										total.city_names = total.city_names.concat(b.city_names ? b.city_names : [b.name]);
                                });
                                total.city_name = total.city_names[0] + ' and ' + (total.city_names.length-1) + ' others';
                                return total;
                        }
                        //Recuperation du fichier json contenant tous les points
                        function map(){
                                $.ajax({ 
                                        url: 'res/bubbles2.json', 
                                        dataType: 'json',
                                        success: function(data) {
                                                kartoLoad(data);    
                                        },
                                        error: function (xhr, ajaxOptions, thrownError) {
                                                alert(xhr.response);
                                                alert(thrownError);
                                        }
                                });
                        };
                                
                        function showError() {           
                            alert('Error'); 
                            return true; 
                        };
                                