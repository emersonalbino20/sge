<legend>Dados do Encarregado</legend>
                    <div className='flex flex-row space-x-3'>
                        <div className='flex flex-col w-full'>
                            <FormField
                            control={form.control}
                            name={`responsaveis.${index}.nomeCompleto`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Nome Completo </FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                <FormMessage className='text-red-500 text-xs'/>
                                </FormControl>
                            </FormItem>)
                            }
                            />
                            
                        </div>
                        <div className='flex flex-col w-full'>
                            
                            <FormField
                            control={form.control}
                            name={`responsaveis.${index}.parentescoId`}
                            
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Parentesco</FormLabel>
                                <FormControl>
                                <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                                <SelectTrigger className='text-black bg-white mt-0 border-gray-300 rounded-sm'>
                                    <SelectValue placeholder="Seleciona o grau"  {...field} />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value='1'>Pai</SelectItem>
                                    <SelectItem value='2'>Mãe</SelectItem>
                                    <SelectItem value='3'>Tio</SelectItem>
                                    <SelectItem value='4'>Irmão</SelectItem>
                                </SelectContent>
                            </Select>
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>)
                            }
                            />
                         
                        </div>
                    </div>
                    <fieldset >
                        <legend>Contacto</legend>
                    
                    <div className='flex flex-row space-x-3 mb-5'>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsaveis.${index}.telefone`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>)
                            }
                            />
                         
                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsaveis.${index}.email`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>)
                            }
                            />
                            
                    </div>
                </div>
                </fieldset>
                <fieldset >
                        <legend>Endereço</legend>
                
                           <div className='flex flex-row space-x-3 mb-5' >
                           <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsaveis.${index}.numeroCasa`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Número de Casa</FormLabel>
                                <FormControl>
                                <Input type='number' {...field}  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>)
                            }
                            />
                      
                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsaveis.${index}.bairro`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Bairro</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>)
                            }
                            />
                           
                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsaveis.${index}.rua`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Rua</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>)
                            }
                            />
                           
                    </div>
                </div>
                {
                    index  && (
                 <p className='text-red-600 cursor-pointer text-center' onClick={()=>{ remove( index )}}>remove</p>
                    )
                }
                </fieldset>
              
                </fieldset>})
                  
                    }       