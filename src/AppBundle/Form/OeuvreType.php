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
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

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
                ->add('author', EntityType::class, array(
                    'class' => 'AppBundle:Author',
                    'choice_label' => 'lastname',
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ))
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

                ])
                ->add('rating', IntegerType::class, [  
                    'label' => 'Rating',
                    'attr' => [
                        'class' => 'form-control'
                    ]

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
