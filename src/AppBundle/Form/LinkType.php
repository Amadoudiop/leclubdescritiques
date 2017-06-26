<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;



use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\RadioType;


use Symfony\Bridge\Doctrine\Form\Type\EntityType;



class LinkType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class, [
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ])
                ->add('url', TextType::class, [
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ])
                ->add('external')
                ->add('menu', EntityType::class, array(
                    'class' => 'AppBundle:Menu',
                    'choice_label' => 'name',
                    'attr' => [
                        'class' => 'form-control'
                    ]
                ));
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Link'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_link';
    }


}
