<?php

namespace AppBundle\Form;

//use AppBundle\Entity\Oeuvre;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
/* form input */
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
/*File upload*/
use Symfony\Component\Form\Extension\Core\Type\FileType;
//use Symfony\Component\HttpFoundation\File\UploadedFile;
class OeuvreType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title', TextType::class, [
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ])
                ->add('url_product', TextType::class, [
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ])
                ->add('description', TextareaType::class, [
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ])
                ->add('url_image', FileType::class, [
                    'data' => null,
                    'label' => 'Image',
                    'required' => false,
                    'attr' => [
                        'class' => 'fileUploader'
                    ]

                ])
                ->add('publication_date', DateType::class, [  
                    'label' => 'Date de publication'

                ]);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Oeuvre'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_oeuvre';
    }


}
