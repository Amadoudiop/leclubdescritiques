<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

/* form input */
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;

class SalonType extends AbstractType
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
                ->add('participants_number', IntegerType::class, [
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ])
                ->add('oeuvre', EntityType::class, array(
                    'class' => 'AppBundle:Oeuvre',
                    'choice_label' => 'title',
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ))
                ->add('user', EntityType::class, array(
                    'class' => 'AppBundle:User',
                    'choice_label' => 'email',
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ))
                ->add('date_start', DateTimeType::class, [
                ])
                ->add('date_end', DateTimeType::class, [
                ]);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Salon'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_salon';
    }


}
